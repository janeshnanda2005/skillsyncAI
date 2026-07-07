from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.database import get_db
from models.basemodel import Student as StudentModel
from schemas.pydantic_models import StudentCreate, StudentUpdate, StudentResponse
from auth.auth import get_current_user

router = APIRouter()


@router.get("/get-student-details", response_model=StudentResponse)
def student_details(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Get full details of a student by their ID."""
    student = db.query(StudentModel).filter(StudentModel.sid == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student


@router.get("/me", response_model=StudentResponse)
def get_my_profile(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Get the profile of the currently logged-in student."""
    email = current_user.get("sub")
    student = db.query(StudentModel).filter(StudentModel.email == email).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found. Please add your profile first.")
    return student


@router.post("/add-student", response_model=StudentResponse, status_code=201)
def add_student(
    student: StudentCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):

    existing = db.query(StudentModel).filter(StudentModel.email == student.email).first()
    if existing:
        raise HTTPException(status_code=409, detail="A student with this email already exists")

    db_student = StudentModel(
        sid=student.sid,
        name=student.name,
        dept=student.dept,
        email=student.email,
        year=student.year,
        cgpa=student.cgpa,
        domain=student.domain,
        created_at=datetime.utcnow(),
    )

    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student


@router.put("/update-student", response_model=StudentResponse)
def update_student(
    student_id: int,
    payload: StudentUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Partially update a student's profile."""
    student = db.query(StudentModel).filter(StudentModel.sid == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(student, key, value)

    db.commit()
    db.refresh(student)
    return student


@router.delete("/delete-student/{student_id}", status_code=200)
def delete_student(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Delete a student profile."""
    student = db.query(StudentModel).filter(StudentModel.sid == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    db.delete(student)
    db.commit()
    return {"message": "Student deleted successfully"}


@router.get("/all-students", response_model=list[StudentResponse])
def get_all_students(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """List all student profiles."""
    return db.query(StudentModel).all()
