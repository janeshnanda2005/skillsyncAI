from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.database import get_db
from auth.auth import hash_password, verify_password, create_access_token
from models.basemodel import Admin as AdminModel, Student as StudentModel
from schemas.pydantic_models import AdminCreate, AdminLogin, AdminResponse, StudentResponse

router = APIRouter()


@router.post("/register", response_model=AdminResponse, status_code=201)
def register_admin(payload: AdminCreate, db: Session = Depends(get_db)):
    """Register a new admin account."""
    if payload.password != payload.correct_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    existing = db.query(AdminModel).filter(AdminModel.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=409, detail="Admin with this email already exists")

    admin = AdminModel(
        name=payload.name,
        email=payload.email,
        password=hash_password(payload.password),
        created_at=datetime.utcnow(),
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)
    return admin


@router.post("/login")
def login_admin(payload: AdminLogin, db: Session = Depends(get_db)):
    """Admin login — returns a JWT token."""
    admin = db.query(AdminModel).filter(AdminModel.email == payload.email).first()
    if not admin or not verify_password(payload.password, admin.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(data={"sub": admin.email, "role": "admin"})
    return {"access_token": token, "token_type": "bearer"}


@router.get("/students", response_model=list[StudentResponse])
def list_all_students(db: Session = Depends(get_db)):
    """(Admin) List every student in the system."""
    return db.query(StudentModel).all()


@router.delete("/students/{student_id}", status_code=200)
def admin_delete_student(student_id: int, db: Session = Depends(get_db)):
    """(Admin) Force-delete a student profile."""
    student = db.query(StudentModel).filter(StudentModel.sid == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    db.delete(student)
    db.commit()
    return {"message": f"Student {student_id} deleted by admin"}
