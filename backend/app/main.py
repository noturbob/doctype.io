import os
import shutil
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# Import our modular parts
from app.models.schemas import ChatRequest, ChatResponse, IngestResponse
from app.services.pdf_loader import load_and_split_pdf
from app.services.redis_store import add_to_vector_store
from app.services.rag_chain import generate_answer

app = FastAPI(title="Doctype.io API", version="1.0")

# Allow the frontend (React) to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, change this to your frontend URL
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "Doctype.io is running 🚀"}

@app.post("/ingest", response_model=IngestResponse)
async def ingest_document(file: UploadFile = File(...)):
    """
    Uploads a PDF, splits it, and saves vectors to Redis.
    """
    # 1. Save file temporarily
    temp_filename = f"temp_{file.filename}"
    with open(temp_filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        # 2. Process the file (Load -> Split)
        chunks = await load_and_split_pdf(temp_filename)
        
        # 3. Store in Redis
        add_to_vector_store(chunks)
        
        return IngestResponse(
            filename=file.filename,
            chunks_processed=len(chunks),
            status="Successfully embedded"
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
    finally:
        # 4. Cleanup
        if os.path.exists(temp_filename):
            os.remove(temp_filename)

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Asks a question to the stored documents.
    """
    try:
        answer = await generate_answer(request.question)
        return ChatResponse(answer=answer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))