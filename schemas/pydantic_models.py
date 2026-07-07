from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# ─── Auth ───────────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    email: str
    password: str


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    correct_password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str


# ─── Student ─────────────────────────────────────────────────────────────────

class StudentCreate(BaseModel):
    sid: Optional[int] = None
    name: str
    dept: str
    email: str
    year: int
    cgpa: float
    domain: str


class StudentUpdate(BaseModel):
    """All fields optional so partial updates work."""
    name: Optional[str] = None
    dept: Optional[str] = None
    email: Optional[str] = None
    year: Optional[int] = None
    cgpa: Optional[float] = None
    domain: Optional[str] = None


class StudentResponse(BaseModel):
    sid: int
    name: str
    dept: str
    email: str
    year: int
    cgpa: float
    domain: str
    created_at: datetime

    class Config:
        from_attributes = True   # Pydantic v2; use orm_mode=True for v1


# ─── Skills ──────────────────────────────────────────────────────────────────

class SkillCreate(BaseModel):
    title: str


class SkillResponse(BaseModel):
    skill_id: int
    sid: int
    title: str

    class Config:
        from_attributes = True


# ─── Certifications ──────────────────────────────────────────────────────────

class CertificationCreate(BaseModel):
    title: str


class CertificationResponse(BaseModel):
    cert_id: int
    sid: int
    title: str

    class Config:
        from_attributes = True


# ─── Projects (student-owned) ────────────────────────────────────────────────

class ProjectCreate(BaseModel):
    title: str
    description: str


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None


class ProjectResponse(BaseModel):
    pid: int
    sid: int
    title: str
    description: str

    class Config:
        from_attributes = True


# ─── Resume ──────────────────────────────────────────────────────────────────

class ResumeResponse(BaseModel):
    r_id: int
    sid: int
    public_id: str
    file_name: str
    file_url: str

    class Config:
        from_attributes = True


# ─── Admin ───────────────────────────────────────────────────────────────────

class AdminCreate(BaseModel):
    name: str
    email: str
    password: str
    correct_password: str


class AdminLogin(BaseModel):
    email: str
    password: str


class AdminResponse(BaseModel):
    aid: int
    name: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Legacy aliases (kept so old imports don't break) ─────────────────────────

class Student(StudentCreate):
    pass


class Skills(SkillResponse):
    pass


class Certification(CertificationResponse):
    pass


class Project(ProjectResponse):
    pass


class Resume(ResumeResponse):
    pass


class Item(BaseModel):
    """Kept for any legacy usage."""
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None