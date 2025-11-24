from pydantic import BaseModel
from typing import Optional, List

class ChatRequest(BaseModel):
    question: str

class ChatResponse(BaseModel):
    answer: str
    sources: Optional[List[str]] = []

class IngestResponse(BaseModel):
    filename: str
    chunks_processed: int
    status: str