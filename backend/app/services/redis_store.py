from langchain_community.vectorstores import Redis
from langchain_huggingface import HuggingFaceEmbeddings
from app.config import settings

# 1. Initialize FREE Local Embeddings
# This runs entirely on your CPU. No API keys needed.
# It downloads a small model (~100MB) the first time you run it.
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

def add_to_vector_store(chunks):
    """
    Takes text chunks, turns them into vectors, and saves them to Redis.
    """
    # NOTE: The class is 'Redis', NOT 'RedisVectorStore' for langchain-community
    Redis.from_documents(
        documents=chunks,
        embedding=embeddings,
        redis_url=settings.REDIS_URL,
        index_name=settings.REDIS_INDEX_NAME
    )
    return True

def get_retriever():
    """
    Connects to the existing Redis index and returns a search tool.
    """
    # NOTE: The class is 'Redis', NOT 'RedisVectorStore' for langchain-community
    vector_store = Redis(
        redis_url=settings.REDIS_URL,
        index_name=settings.REDIS_INDEX_NAME,
        embedding=embeddings
    )
    
    # k=3 means "Find the top 3 most relevant chunks"
    return vector_store.as_retriever(search_kwargs={"k": 3})