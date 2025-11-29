import os
import shutil
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware

# Import our modular parts
from app.models.schemas import ChatRequest, ChatResponse, IngestResponse
from app.services.pdf_loader import load_and_split_pdf
from app.services.vector_store import add_to_vector_store
from app.services.rag_chain import generate_answer
from app.config import settings

app = FastAPI(title="Doctype.io API", version="1.0")

# --- Fix CORS to allow frontend ---
# We list all the origins that are allowed to talk to this backend
origins = [
    settings.FRONTEND_URL,              # The URL from your .env file
    "http://localhost:3000",            # Local development
    "https://doctype-io.vercel.app",    # Production URL (Standard)
    "https://doctype-io.vercel.app/"    # Production URL (With trailing slash)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Clerk Authentication (Simplified for now)
async def verify_clerk_token(request: Request):
    """Verify Clerk JWT token from Authorization header"""
    auth_header = request.headers.get("Authorization")
    
    # For development: Allow requests without auth
    # TODO: Implement proper Clerk verification in production
    if not auth_header:
        # Comment this out in production
        return "dev-mode"  
        # Uncomment for production:
        # raise HTTPException(status_code=401, detail="Missing authorization header")
    
    try:
        token = auth_header.replace("Bearer ", "")
        # TODO: Verify token with Clerk SDK
        # from clerk_sdk_python import Clerk
        # clerk = Clerk(bearer_auth=settings.CLERK_SECRET_KEY)
        # clerk.verify_token(token)
        return token
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/")
def health_check():
    return {"status": "Doctype.io is running 🚀"}

@app.post("/ingest", response_model=IngestResponse)
async def ingest_document(
    file: UploadFile = File(...), 
    token: str = Depends(verify_clerk_token)
):
    """
    Uploads a PDF, splits it, and saves vectors to Upstash Vector DB.
    """
    # 1. Save file temporarily
    temp_filename = f"temp_{file.filename}"
    
    try:
        with open(temp_filename, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # 2. Process the file (Load -> Split)
        print(f"📄 Loading PDF: {file.filename}")
        chunks = await load_and_split_pdf(temp_filename)
        
        # 3. Store in Vector DB (Upstash)
        print(f"🚀 Storing {len(chunks)} chunks in Upstash...")
        add_to_vector_store(chunks)
        
        return IngestResponse(
            filename=file.filename,
            chunks_processed=len(chunks),
            status="Successfully embedded"
        )
    except Exception as e:
        print(f"❌ Error during ingestion: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # 4. Cleanup
        if os.path.exists(temp_filename):
            os.remove(temp_filename)

@app.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest, 
    token: str = Depends(verify_clerk_token)
):
    """
    Asks a question to the stored documents.
    """
    try:
        answer = await generate_answer(request.question)
        return ChatResponse(answer=answer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))