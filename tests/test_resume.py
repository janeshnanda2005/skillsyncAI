from unittest.mock import Mock, patch
from datetime import datetime, timezone

from models.basemodel import Resume, Student


def create_student(db, sid=301):
    student = Student(
        sid=sid,
        name="Resume User",
        dept="CS",
        email="testuser@example.com",
        year=3,
        cgpa=9.0,
        domain="AI",
        created_at=datetime.now(timezone.utc),
    )
    db.add(student)
    db.commit()
    return student


def test_upload_resume_returns_saved_resume(client, token_headers, db):
    create_student(db)

    response = client.post(
        "/resume/upload-resume",
        files={"file": ("resume.pdf", b"pdf bytes", "application/pdf")},
        headers=token_headers,
    )

    assert response.status_code == 201
    body = response.json()
    assert body["sid"] == 301
    assert body["file_name"] == "resume.pdf"
    assert body["public_id"].startswith("resume-")


def test_update_resume_returns_updated_fields(client, token_headers, db):
    student = create_student(db, sid=302)
    resume = Resume(
        sid=student.sid,
        public_id="resume-existing",
        file_name="old.pdf",
        file_data=b"old bytes",
    )
    db.add(resume)
    db.commit()

    response = client.put(
        "/resume/update-resume",
        params={"student_id": student.sid},
        json={"file_name": "updated.pdf"},
        headers=token_headers,
    )

    assert response.status_code == 200
    assert response.json()["file_name"] == "updated.pdf"


def test_gist_model_returns_ai_response(client, token_headers, db):
    student = create_student(db, sid=303)
    resume = Resume(
        sid=student.sid,
        public_id="resume-ai",
        file_name="ai.pdf",
        file_data=b"pdf bytes",
    )
    db.add(resume)
    db.commit()

    document = Mock(page_content="Python and FastAPI")
    model = Mock()
    model.invoke.return_value.content = "Use more measurable resume bullets."

    with patch("routes.resume.embedding_documents", return_value=Mock(invoke=Mock(return_value=[document]))), \
         patch("routes.resume.model_initalization", return_value=model):
        response = client.post(
            "/resume/gist-model",
            params={"resumeid": resume.r_id},
            json={"msg": "How can I improve this resume?"},
            headers=token_headers,
        )

    assert response.status_code == 200
    assert response.json() == "Use more measurable resume bullets."
    model.invoke.assert_called_once()


def test_gist_model_cleans_structured_ai_response(client, token_headers, db):
    student = create_student(db, sid=305)
    resume = Resume(
        sid=student.sid,
        public_id="resume-clean",
        file_name="clean.pdf",
        file_data=b"pdf bytes",
    )
    db.add(resume)
    db.commit()

    document = Mock(page_content="Python and FastAPI")
    model = Mock()
    model.invoke.return_value.content = [
        {"text": "## Resume feedback\n"},
        {"text": "- Add measurable results.\n"},
        {"text": "- Remove outdated skills."},
    ]

    with patch("routes.resume.embedding_documents", return_value=Mock(invoke=Mock(return_value=[document]))), \
         patch("routes.resume.model_initalization", return_value=model):
        response = client.post(
            "/resume/gist-model",
            params={"resumeid": resume.r_id},
            json={"msg": "Give me clean feedback."},
            headers=token_headers,
        )

    assert response.status_code == 200
    assert response.json() == "Resume feedback Add measurable results. Remove outdated skills."


def test_gist_model_rejects_empty_input(client, token_headers, db):
    student = create_student(db, sid=304)
    resume = Resume(
        sid=student.sid,
        public_id="resume-empty",
        file_name="empty.pdf",
        file_data=b"pdf bytes",
    )
    db.add(resume)
    db.commit()

    response = client.post(
        "/resume/gist-model",
        params={"resumeid": resume.r_id},
        json={"msg": "   "},
        headers=token_headers,
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "The payload is empty"