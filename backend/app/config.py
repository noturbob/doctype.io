from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Google AI
    GOOGLE_API_KEY: str
    
    # Upstash Vector Database
    UPSTASH_VECTOR_REST_URL: str
    UPSTASH_VECTOR_REST_TOKEN: str
    
    # Clerk Authentication (optional for development)
    CLERK_SECRET_KEY: str = "dev-mode-no-auth"
    
    # Frontend URL for CORS
    FRONTEND_URL: str = "http://localhost:3000"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()