import time
import random
from langchain_community.vectorstores import UpstashVectorStore
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from app.config import settings

# 1. Initialize API-based Embeddings (Google)
# Try text-embedding-004 which has better quota
embeddings = GoogleGenerativeAIEmbeddings(
    model="models/text-embedding-004", 
    google_api_key=settings.GOOGLE_API_KEY
)

# 2. Initialize Upstash (Serverless Vector DB)
vector_store = UpstashVectorStore(
    embedding=embeddings,
    text_key="page_content",
    index_url=settings.UPSTASH_VECTOR_REST_URL,
    index_token=settings.UPSTASH_VECTOR_REST_TOKEN
)

def add_to_vector_store(chunks):
    """
    Sends text chunks to Google (for embeddings) and then Upstash (for storage).
    Includes Smart Rate Limiting & Retries for Free Tier.
    """
    # ULTRA conservative batch size for Free Tier (process 1 chunk at a time)
    batch_size = 1  
    total_chunks = len(chunks)
    
    print(f"🚀 Starting ingestion of {total_chunks} chunks with ULTRA Rate Limiting...")
    
    for i in range(0, total_chunks, batch_size):
        batch = chunks[i : i + batch_size]
        batch_num = i // batch_size + 1
        
        # Retry logic: Try up to 3 times before giving up
        max_retries = 3
        
        for attempt in range(max_retries):
            try:
                print(f"   - Processing chunk {batch_num}/{total_chunks} (Attempt {attempt + 1})...")
                vector_store.add_documents(batch)
                
                # Success! Wait LONGER to be nice to the API
                time.sleep(3.0)  # Increased from 1.5 to 3 seconds 
                break 
                
            except Exception as e:
                error_msg = str(e).lower()
                
                if "429" in error_msg or "quota" in error_msg or "rate" in error_msg:
                    # Exponential Backoff with LONGER waits: 5s, 10s, 20s...
                    wait_time = (5 * (2 ** attempt)) + random.uniform(0, 2)
                    print(f"     ⚠️ Rate limit hit. Cooling down for {wait_time:.1f} seconds...")
                    time.sleep(wait_time)
                else:
                    # If it's not a rate limit error, crash properly
                    print(f"❌ Critical Error on batch {batch_num}: {e}")
                    raise e
        else:
            # If we ran out of retries (for loop completed without break)
            raise Exception(f"Failed to process batch {batch_num} after {max_retries} retries due to Rate Limits.")
    
    print(f"✅ Successfully added {total_chunks} chunks to Upstash Vector DB.")
    return True

def get_retriever():
    """
    Returns the search tool for the RAG chain.
    """
    return vector_store.as_retriever(search_kwargs={"k": 3})