import os
os.environ["DATABASE_URL"] = "sqlite:///:memory:"
os.environ["SECRET_KEY"] = "test_secret_key_1234567890_test_secret_key_1234567890"
os.environ["ALGORITHM"] = "HS256"
os.environ["ACCESS_TOKEN_EXPIRE_MINUTES"] = "30"

from main import app
from fastapi.testclient import TestClient
from database.database import Session, engine
from models.basemodel import Base, Student, Resume
from auth.auth import get_current_user

Base.metadata.create_all(bind=engine)

with Session() as session:
    session.add(Student(sid=1, name='Test', dept='CSE', email='s@example.com', year=2024, cgpa=8.5, domain='AI', created_at=None))
    session.add(Resume(r_id=1, sid=1, public_id='p1', file_name='resume.pdf', file_data=b'pdf-bytes'))
    session.commit()

app.dependency_overrides[get_current_user] = lambda: {"sub": "s@example.com"}

client = TestClient(app)
resp = client.post('/resume/gist-model?resumeid=1', json={'msg': 'Tell me about the resume'})
print(resp.status_code)
print(resp.text)
