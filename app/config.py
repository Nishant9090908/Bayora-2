"""
Configuration module for Bayora.
Loads environment variables safely with defaults.
"""
import os
from pathlib import Path

# Base directory of the repository
BASE_DIR = Path(__file__).resolve().parent.parent

# Helper to load .env file manually without external dotenv dependency
def _load_env_file():
    env_file = BASE_DIR / ".env"
    if env_file.exists():
        with open(env_file, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                k, v = line.split("=", 1)
                k = k.strip()
                v = v.strip().strip("'").strip('"')
                if k not in os.environ:
                    os.environ[k] = v

_load_env_file()

class Settings:
    APP_NAME: str = os.getenv("APP_NAME", "Bayora")
    APP_ENV: str = os.getenv("APP_ENV", "development")
    DEBUG: bool = os.getenv("DEBUG", "True").lower() in ("true", "1")
    HOST: str = os.getenv("HOST", "127.0.0.1")
    PORT: int = int(os.getenv("PORT", "8000"))

    # Security & Cryptography
    JWT_SECRET: str = os.getenv("JWT_SECRET", "bayora_dev_secret_change_in_production_key_123456")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "480"))

    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR / 'bayora.db'}")

    # Isolated Target LLM settings
    TARGET_LLM_PROVIDER: str = os.getenv("TARGET_LLM_PROVIDER", "mock")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    TARGET_MODEL_NAME: str = os.getenv("TARGET_MODEL_NAME", "gpt-4o-mini")

settings = Settings()
