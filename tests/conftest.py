import os
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch
import sqlalchemy

# Set environment variables for testing before importing application modules
os.environ["DATABASE_URL"] = "sqlite:///:memory:"
os.environ["SECRET_KEY"] = "test_secret_key_1234567890_test_secret_key_1234567890"
os.environ["ALGORITHM"] = "HS256"
os.environ["ACCESS_TOKEN_EXPIRE_MINUTES"] = "30"

# Intercept create_engine to supply SQLite-specific thread and pool arguments
original_create_engine = sqlalchemy.create_engine

def custom_create_engine(*args, **kwargs):
    if args[0].startswith("sqlite:"):
        kwargs["connect_args"] = {"check_same_thread": False}
        from sqlalchemy.pool import StaticPool
        kwargs["poolclass"] = StaticPool
    return original_create_engine(*args, **kwargs)

# Apply the patch immediately before importing application files
engine_patcher = patch("sqlalchemy.create_engine", custom_create_engine)
engine_patcher.start()

from database.database import engine, Session
from models.basemodel import Base
from main import app

@pytest.fixture(scope="session", autouse=True)
def init_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(autouse=True)
def db():
    db_session = Session()
    
    # Patch Session constructor to return this session
    with patch("database.database.Session", return_value=db_session):
        yield db_session
        
    db_session.close()
    
    # Clean up all tables in reverse order to satisfy foreign key constraints
    cleanup_session = Session()
    try:
        for table in reversed(Base.metadata.sorted_tables):
            cleanup_session.execute(table.delete())
        cleanup_session.commit()
    except Exception:
        cleanup_session.rollback()
    finally:
        cleanup_session.close()

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def token_headers(client):
    user_data = {
        "uid": 999,
        "name": "Test User",
        "email": "testuser@example.com",
        "password": "password123",
        "correct_password": "password123"
    }
    client.post("/auth/register", json=user_data)
    
    login_data = {
        "email": "testuser@example.com",
        "password": "password123"
    }
    response = client.post("/auth/login", json=login_data)
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
