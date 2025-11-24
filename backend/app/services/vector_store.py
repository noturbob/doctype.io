from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings

# 1. Initialize Embeddings
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# Global variable to hold the vector store in memory
# Since FAISS is in-memory, if you restart the server, this resets (Ephemeral).
vector_store = None

def add_to_vector_store(chunks):
    """
    Creates a new FAISS index from the document chunks.
    """
    global vector_store
    
    # Create a new FAISS index from documents
    vector_store = FAISS.from_documents(
        documents=chunks,
        embedding=embeddings
    )
    return True

def get_retriever():
    """
    Returns the retriever from the current FAISS index.
    """
    global vector_store
    
    if vector_store is None:
        # If no document is uploaded yet, create an empty one to prevent crashes
        return FAISS.from_texts(
            ["Empty index"], 
            embeddings
        ).as_retriever(search_kwargs={"k": 1})
        
    return vector_store.as_retriever(search_kwargs={"k": 3})