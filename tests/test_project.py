from unittest.mock import patch
from fastapi.testclient import TestClient

def test_upload_resume_success(client, token_headers):
    # Add a student profile with the same email as the logged-in user (from token_headers fixture)
    student_data = {
        "sid": 201,
        "name": "Test User",
        "dept": "CS",
        "email": "testuser@example.com",
        "year": 3,
        "cgpa": 9.0,
        "domain": "AI"
    }
    client.post("/students/add-student", json=student_data, headers=token_headers)
    
    mock_upload_response = {
        "public_id": "resumes/test_public_id",
        "original_filename": "test_resume",
        "secure_url": "https://cloudinary.com/resumes/test_public_id.pdf"
    }
    
    with patch("cloudinary.uploader.upload", return_value=mock_upload_response) as mock_upload:
        file_content = b"Mock PDF Content"
        files = {"file": ("test_resume.pdf", file_content, "application/pdf")}
        
        response = client.post("/projects/upload-resume", files=files, headers=token_headers)
        
        assert response.status_code == 200
        assert response.json()["message"] == "Resume uploaded successfully"
        assert response.json()["file_name"] == "test_resume"
        assert response.json()["file_url"] == "https://cloudinary.com/resumes/test_public_id.pdf"
        
        mock_upload.assert_called_once()

def test_upload_resume_no_student_profile(client, token_headers):
    mock_upload_response = {
        "public_id": "resumes/test_public_id",
        "original_filename": "test_resume",
        "secure_url": "https://cloudinary.com/resumes/test_public_id.pdf"
    }
    
    with patch("cloudinary.uploader.upload", return_value=mock_upload_response):
        file_content = b"Mock PDF Content"
        files = {"file": ("test_resume.pdf", file_content, "application/pdf")}
        
        response = client.post("/projects/upload-resume", files=files, headers=token_headers)
        
        assert response.status_code == 404
        assert response.json()["detail"] == "Student profile not found"
