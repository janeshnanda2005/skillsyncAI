from pydantic import BaseModel, ConfigDict, EmailStr
from typing import Optional
from datetime import datetime


# ─── Auth ───────────────────────────────────────────────────────────────────

# class LoginRequest(BaseModel):
#     email: str
#     password: str

class LoginRequest(BaseModel):
    email:str
    password:str


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    correct_password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    name: str
    email: str


# ─── Student ─────────────────────────────────────────────────────────────────

class StudentCreate(BaseModel):
    sid: Optional[int] = None
    name: str
    dept: str
    email: str
    year: int


class StudentUpdate(BaseModel):
    """All fields optional so partial updates work."""
    name: Optional[str] = None
    dept: Optional[str] = None
    email: Optional[str] = None
    year: Optional[int] = None
    cgpa: Optional[float] = None
    domain: Optional[str] = None


class StudentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    sid: int
    name: str
    dept: str
    email: str
    year: int
    cgpa: float
    domain: str
    created_at: datetime

# ─── Skills ──────────────────────────────────────────────────────────────────

class SkillCreate(BaseModel):
    title: str


class SkillResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    skill_id: int
    sid: int
    title: str

# ─── Certifications ──────────────────────────────────────────────────────────

class CertificationCreate(BaseModel):
    title: str


class CertificationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    cert_id: int
    sid: int
    title: str

# ─── Projects (student-owned) ────────────────────────────────────────────────

class ProjectCreate(BaseModel):
    title: str
    description: str


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None


class ProjectResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    pid: int
    sid: int
    title: str
    description: str

# ─── Resume ──────────────────────────────────────────────────────────────────

class ResumeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    r_id: int
    sid: int
    public_id: str
    file_name: str

class ResumeCreate(BaseModel):
    r_id:int
    sid:int
    public_id:str
    file_name:str
    file_data: bytes

class Resumegist(BaseModel):
    msg:str

class ResumeUpdate(BaseModel):
   file_name:Optional[str] = None
   file_data:Optional[bytes] =None
    

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
    model_config = ConfigDict(from_attributes=True)

    aid: int
    name: str
    email: str
    created_at: datetime

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