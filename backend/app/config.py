from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    supabase_url: str = ""
    supabase_service_role_key: str = ""
    supabase_jwt_secret: str = ""
    vite_supabase_anon_key: str = ""

    groq_api_key: str = ""
    groq_model_default: str = "qwen/qwen3.8-27b"
    groq_model_fast: str = "qwen/qwen3.8-27b"

    google_ai_api_key: str = ""
    google_model_default: str = "gemini-3.8-flash"
    google_embedding_model: str = "gemini-embedding-001"

    llm_primary_provider: str = "groq"
    llm_fallback_provider: str = "google"
    vision_provider: str = "google"
    embedding_provider: str = "google"

    app_env: str = "development"
    log_level: str = "INFO"
    cors_origins: str = "http://localhost:5173"

    model_config = {"env_file": "../.env", "env_file_encoding": "utf-8", "extra": "ignore"}


@lru_cache()
def get_settings() -> Settings:
    return Settings()
