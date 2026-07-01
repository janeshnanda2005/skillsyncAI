# SkillSyncAI Backend

A scalable backend service for the SkillSyncAI platform built with **FastAPI**, **PostgreSQL**, and **SQLAlchemy**. It provides secure RESTful APIs for student management, user authentication, and future AI-powered skill analysis.

---

## Overview

The SkillSyncAI Backend is responsible for:

- Managing student records
- User authentication using JWT
- Database operations with SQLAlchemy ORM
- Request validation using Pydantic
- Exposing RESTful APIs
- Serving as the backend foundation for the SkillSyncAI platform

---

## Features

- RESTful API using FastAPI
- PostgreSQL Integration
- SQLAlchemy ORM
- JWT Authentication
- Pydantic Validation
- CRUD Operations
- Modular Project Structure
- Swagger API Documentation
- Error Handling
- Scalable Architecture

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Python | Programming Language |
| FastAPI | Backend Framework |
| PostgreSQL | Database |
| SQLAlchemy | ORM |
| Pydantic | Request Validation |
| JWT | Authentication |
| Uvicorn | ASGI Server |

---

## Project Structure

```text
SkillSyncAI-Backend/
│
├── auth/
│   ├── jwt_handler.py
│   ├── hashing.py
│   ├── oauth2.py
│   └── dependencies.py
│
├── database/
│   ├── database.py
│   └── database_models.py
│
├── models/
│
├── schemas/
│   ├── student.py
│   ├── auth.py
│   └── user.py
│
├── routes/
│   ├── student.py
│   ├── auth.py
│   └── user.py
│
├── services/
│   ├── student_service.py
│   └── auth_service.py
│
├── config.py
├── main.py
├── requirements.txt
├── .env
└── README.md
```

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/<your-username>/SkillSyncAI-Backend.git
```

```bash
cd SkillSyncAI-Backend
```

---

### Create a Virtual Environment

Windows

```bash
python -m venv venv
venv\Scripts\activate
```

Linux / macOS

```bash
python3 -m venv venv
source venv/bin/activate
```

---

### Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Database Configuration

Create a PostgreSQL database.

Example:

```text
Database : skillsyncai
Username : postgres
Password : your_password
Host     : localhost
Port     : 5432
```

Create a `.env` file:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/skillsyncai

SECRET_KEY=your_secret_key

ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=30
```

---

## Running the Application

```bash
uvicorn main:app --reload
```

Server

```
http://127.0.0.1:8000
```

Swagger Documentation

```
http://127.0.0.1:8000/docs
```

ReDoc Documentation

```
http://127.0.0.1:8000/redoc
```

---

## API Modules

### Authentication

- User Login
- JWT Token Generation
- Route Protection
- Password Verification

---

### Student Management

- Create Student
- Get Student
- Get All Students
- Update Student
- Delete Student

---

## Authentication

The backend uses JWT-based authentication.

### Login

```http
POST /auth/login
```

Request

```json
{
    "username": "admin",
    "password": "1234"
}
```

Response

```json
{
    "access_token": "<jwt-token>",
    "token_type": "bearer"
}
```

For protected endpoints include:

```
Authorization: Bearer <jwt-token>
```

---

## Student API

### Create Student

```
POST /students
```

### Get All Students

```
GET /students
```

### Get Student by ID

```
GET /students/{id}
```

### Update Student

```
PUT /students/{id}
```

### Delete Student

```
DELETE /students/{id}
```

---

## Database Schema

### Student

| Field | Type |
|-------|------|
| sid | Integer |
| name | String |
| age | Integer |
| dept | String |

---

### User

| Field | Type |
|-------|------|
| id | Integer |
| username | String |
| hashed_password | String |
| role | String |

---

## Skills Demonstrated

- FastAPI
- REST API Design
- SQLAlchemy ORM
- PostgreSQL
- JWT Authentication
- Pydantic
- CRUD Operations
- Backend Architecture
- Dependency Injection
- Authentication & Authorization
- Database Design

---

## Future Enhancements

- User Registration
- Role-Based Access Control (RBAC)
- Refresh Tokens
- Password Reset
- Email Verification
- Skill Management Module
- Resume Upload API
- AI Skill Recommendation API
- Docker Support
- Redis Caching
- Background Tasks
- Alembic Database Migrations
- Unit Testing
- CI/CD Pipeline
- API Versioning
- Deployment

---

## Development

Start the development server:

```bash
uvicorn main:app --reload
```

Run tests (when available):

```bash
pytest
```

---

## Author

**Janesh**

Computer Engineering Student

Interests:
- Artificial Intelligence
- Machine Learning
- Backend Development
- Cloud Computing
- Autonomous Systems

---

## License

This project is licensed under the MIT License.