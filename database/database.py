from pathlib import Path
import os
from urllib.parse import urlparse

import psycopg2
from psycopg2 import sql

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.engine import make_url
from sqlalchemy.orm import sessionmaker

load_dotenv(dotenv_path=Path(__file__).resolve().parent / ".env")

db_url = os.getenv("DATABASE_URL")
if not db_url:
	raise RuntimeError("DATABASE_URL is not set. Check database/.env or your environment variables.")


engine = create_engine(db_url,pool_size=3,max_overflow=2)
Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
	"""Dependency for getting database session."""
	db = Session()
	try:
		yield db
	finally:
		db.close()
