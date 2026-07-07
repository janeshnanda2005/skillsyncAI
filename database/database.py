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

def _ensure_database_exists(database_url: str) -> None:
	url = make_url(database_url)
	if url.get_backend_name() not in {"postgresql", "postgresql+psycopg2"}:
		return

	database_name = url.database
	if not database_name:
		return

	admin_database = "postgres"
	connection = psycopg2.connect(
		host=url.host,
		port=url.port or 5432,
		user=url.username,
		password=url.password,
		dbname=admin_database,
	)
	connection.autocommit = True

	with connection.cursor() as cursor:
		cursor.execute("SELECT 1 FROM pg_database WHERE datname = %s", (database_name,))
		if cursor.fetchone() is None:
			cursor.execute(sql.SQL("CREATE DATABASE {} ").format(sql.Identifier(database_name)))

	connection.close()


_ensure_database_exists(db_url)

engine = create_engine(db_url)
Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    """FastAPI dependency that yields a DB session and closes it after the request."""
    db = Session()
    try:
        yield db
    finally:
        db.close()