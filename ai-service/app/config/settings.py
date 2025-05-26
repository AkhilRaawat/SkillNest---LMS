from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    openai_api_key: str
    database_url: str = "mongodb://localhost:27017/lms"
    cors_origins: List[str] = ["http://localhost:3000", "http://localhost:5173"]
    
    class Config:
        env_file = ".env"

settings = Settings()