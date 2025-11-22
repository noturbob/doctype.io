from pydantic import BaseModel
from typing import Optional, List

# Request Model: What the frontend sends for chat
class ChatRequest(BaseModel):
    question: str

# Response Model: What we send back after chatting
class ChatResponse(BaseModel):
    answer: str
    sources: Optional[List[str]] = []

# Response Model: What we send back after uploading
class IngestResponse(BaseModel):
    filename: str
    chunks_processed: int
    status: str