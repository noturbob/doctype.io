import os
from typing import Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # We use Google Gemini (Free) for the Chat Model
    GOOGLE_API_KEY: str
    
    # We use Redis for the Database
    REDIS_URL: str = "redis://localhost:6379"
    REDIS_INDEX_NAME: str = "doctype"

    # Optional: Keep OpenAI here just in case you want to switch back later, but it's not used now.
    OPENAI_API_KEY: Optional[str] = None 

    class Config:
        env_file = ".env"

settings = Settings()