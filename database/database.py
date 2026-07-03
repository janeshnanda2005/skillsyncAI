from pathlib import Path
import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

load_dotenv(dotenv_path=Path(__file__).resolve().parent / ".env")

db_url = os.getenv("DATABASE_URL")
if not db_url:
	raise RuntimeError("DATABASE_URL is not set. Check database/.env or your environment variables.")

engine = create_engine(db_url)
Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)