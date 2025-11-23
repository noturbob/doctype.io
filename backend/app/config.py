import os
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # We use Google Gemini (Free) for the Chat Model
    GOOGLE_API_KEY: str
    
    # Optional: Keep OpenAI here just in case you want to switch back later
    OPENAI_API_KEY: Optional[str] = None 

    # This configuration tells Pydantic to read from .env but IGNORE variables
    # that are not defined in this class (like the old REDIS_* vars)
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()