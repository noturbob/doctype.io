import os
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    GOOGLE_API_KEY: str
    
    # We tell Pydantic to load from .env AND ignore any extra keys (like REDIS_URL)
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()