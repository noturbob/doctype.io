import os
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings

# Initialize Embeddings
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

DB_PATH = "faiss_index"

def add_to_vector_store(chunks):
    """
    Takes text chunks, turns them into vectors, and saves them to a local FAISS index.
    """
    if os.path.exists(DB_PATH):
        # Load existing index and add new chunks
        db = FAISS.load_local(DB_PATH, embeddings, allow_dangerous_deserialization=True)
        db.add_documents(chunks)
    else:
        # Create new index from chunks
        db = FAISS.from_documents(chunks, embeddings)
    
    # Save to disk
    db.save_local(DB_PATH)
    return True

def get_retriever():
    """
    Loads the local FAISS index and returns a search tool.
    """
    if not os.path.exists(DB_PATH):
        # Return an empty index if none exists yet
        empty_db = FAISS.from_texts([""], embeddings)
        return empty_db.as_retriever(search_kwargs={"k": 1})

    vector_store = FAISS.load_local(DB_PATH, embeddings, allow_dangerous_deserialization=True)
    return vector_store.as_retriever(search_kwargs={"k": 3})