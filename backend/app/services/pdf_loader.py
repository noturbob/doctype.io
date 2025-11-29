from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

async def load_and_split_pdf(file_path: str):
    """
    1. Loads a PDF from a file path.
    2. Splits it into 1000-character chunks for the AI.
    """
    # 1. Load the file
    loader = PyPDFLoader(file_path)
    docs = loader.load()
    
    # 2. Split the text
    # We overlap by 200 characters so sentences aren't cut in half awkwardly
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000, 
        chunk_overlap=200
    )
    chunks = text_splitter.split_documents(docs)
    
    print(f"📄 Loaded PDF: {len(docs)} pages → {len(chunks)} chunks")
    
    return chunks