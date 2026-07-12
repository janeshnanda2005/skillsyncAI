from fastapi.testclient import TestClient

def test_register_user_success(client):
    user_data = {
        "uid": 10,
        "name": "Alice",
        "email": "alice@example.com",
        "password": "alicepassword",
        "correct_password": "alicepassword"
    }
    response = client.post("/auth/register", json=user_data)
    assert response.status_code == 200
    assert response.json() == {"message": "User registered successfully"}

def test_register_user_password_mismatch(client):
    user_data = {
        "uid": 11,
        "name": "Bob",
        "email": "bob@example.com",
        "password": "password123",
        "correct_password": "password456"
    }
    response = client.post("/auth/register", json=user_data)
    assert response.status_code == 400
    assert response.json()["detail"] == "passwords do not match"

def test_register_user_duplicate_email(client):
    user_data = {
        "uid": 12,
        "name": "User A",
        "email": "duplicate@example.com",
        "password": "password123",
        "correct_password": "password123"
    }
    response = client.post("/auth/register", json=user_data)
    assert response.status_code == 200
    
    user_data["uid"] = 13
    response = client.post("/auth/register", json=user_data)
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"

def test_login_user_success(client):
    user_data = {
        "uid": 14,
        "name": "Charlie",
        "email": "charlie@example.com",
        "password": "charliepassword",
        "correct_password": "charliepassword"
    }
    client.post("/auth/register", json=user_data)
    
    login_data = {
        "email": "charlie@example.com",
        "password": "charliepassword"
    }
    response = client.post("/auth/login", json=login_data)
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"

def test_login_user_invalid_credentials(client):
    login_data = {
        "email": "nonexistent@example.com",
        "password": "wrongpassword"
    }
    response = client.post("/auth/login", json=login_data)
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"

def test_verify_user_token(client):
    user_data = {
        "uid": 15,
        "name": "David",
        "email": "david@example.com",
        "password": "davidpassword",
        "correct_password": "davidpassword"
    }
    client.post("/auth/register", json=user_data)
    
    login_data = {
        "email": "david@example.com",
        "password": "davidpassword"
    }
    login_res = client.post("/auth/login", json=login_data)
    token = login_res.json()["access_token"]
    
    response = client.post(f"/auth/verify-token?token={token}")
    assert response.status_code == 200
    assert response.json() == {"message": "Token is valid"}

def test_logout_user(client):
    response = client.post("/auth/logout")
    assert response.status_code == 200
    assert response.json() == {"message": "user logged out successfully"}

def test_current_user_authenticated(client):
    user_data = {
        "uid": 16,
        "name": "Eve",
        "email": "eve@example.com",
        "password": "evepassword",
        "correct_password": "evepassword"
    }
    client.post("/auth/register", json=user_data)
    
    login_data = {
        "email": "eve@example.com",
        "password": "evepassword"
    }
    login_res = client.post("/auth/login", json=login_data)
    token = login_res.json()["access_token"]
    
    response = client.get(f"/auth/current-user?token={token}")
    assert response.status_code == 200
    assert response.json()["message"] == "Current user details"
    assert response.json()["user"]["sub"] == "eve@example.com"


def test_register_and_login_with_long_password(client):
    long_password = "p" * 100
    user_data = {
        "uid": 17,
        "name": "Frank",
        "email": "frank@example.com",
        "password": long_password,
        "correct_password": long_password,
    }

    register_response = client.post("/auth/register", json=user_data)
    assert register_response.status_code == 201

    login_response = client.post(
        "/auth/login",
        json={"email": "frank@example.com", "password": long_password},
    )
    assert login_response.status_code == 200
    assert "access_token" in login_response.json()
