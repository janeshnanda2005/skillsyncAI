from fastapi.testclient import TestClient

def test_add_student_success(client, token_headers):
    student_data = {
        "sid": 101,
        "name": "John Doe",
        "dept": "CS",
        "email": "johndoe@example.com",
        "year": 3,
        "cgpa": 9.1,
        "domain": "Software Development"
    }
    response = client.post("/students/add-student", json=student_data, headers=token_headers)
    assert response.status_code == 200
    assert response.json() == {"message": "Student added successfully"}

def test_get_student_details_success(client, token_headers):
    student_data = {
        "sid": 102,
        "name": "Jane Smith",
        "dept": "EC",
        "email": "janesmith@example.com",
        "year": 4,
        "cgpa": 8.7,
        "domain": "Electronics"
    }
    client.post("/students/add-student", json=student_data, headers=token_headers)
    
    response = client.get("/students/get-student-details?student_id=102", headers=token_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Jane Smith"
    assert data["email"] == "janesmith@example.com"
    assert data["sid"] == 102

def test_get_student_details_not_found(client, token_headers):
    response = client.get("/students/get-student-details?student_id=9999", headers=token_headers)
    assert response.status_code == 404
    assert response.json()["detail"] == "Student not found"

def test_update_student_success(client, token_headers):
    student_data = {
        "sid": 103,
        "name": "Bob Miller",
        "dept": "ME",
        "email": "bobmiller@example.com",
        "year": 2,
        "cgpa": 7.5,
        "domain": "Robotics"
    }
    client.post("/students/add-student", json=student_data, headers=token_headers)
    
    update_data = {
        "name": "Bob Miller Jr.",
        "cgpa": 8.0
    }
    response = client.put("/students/update-student?student_id=103", json=update_data, headers=token_headers)
    assert response.status_code == 200
    assert response.json()["message"] == "Student details updated successfully"
    assert response.json()["student"]["name"] == "Bob Miller Jr."
    assert response.json()["student"]["cgpa"] == 8.0

def test_update_student_not_found(client, token_headers):
    update_data = {
        "name": "Nonexistent"
    }
    response = client.put("/students/update-student?student_id=9999", json=update_data, headers=token_headers)
    assert response.status_code == 404
    assert response.json()["detail"] == "Student not found"
