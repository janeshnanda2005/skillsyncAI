from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.database import get_db
from auth.auth import get_current_user
from models.basemodel import Skills as SkillModel, Student as StudentModel, User as UserModel
from schemas.pydantic_models import SkillCreate, SkillResponse

router = APIRouter()


# ── Helper: resolve student from logged-in user ──────────────────────────────

def _get_student_by_user(current_user: dict, db: Session) -> StudentModel:
    email = current_user.get("sub")
    student = db.query(StudentModel).filter(StudentModel.email == email).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")
    return student


# ── Endpoints ────────────────────────────────────────────────────────────────

@router.post("/add-skill", response_model=SkillResponse, status_code=201)
def add_skill(
    payload: SkillCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    email = current_user.get("sub")
    student = db.query(StudentModel).filter(StudentModel.email == email).first()

    if not student:
        user = db.query(UserModel).filter(UserModel.email == email).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Bootstrap a minimal student profile so first-time users can add skills.
        student = StudentModel(
            name=user.name,
            dept="NA",
            email=user.email,
            year=1,
            cgpa=0.0,
            domain="General",
            created_at=datetime.utcnow(),
        )
        db.add(student)
        db.commit()
        db.refresh(student)

    existing = (
        db.query(SkillModel)
        .filter(SkillModel.sid == student.sid, SkillModel.title == payload.title)
        .first()
    )
    if existing:
        raise HTTPException(status_code=409, detail="Skill already exists for this student")

    skill = SkillModel(sid=student.sid, title=payload.title)
    db.add(skill)
    db.commit()
    db.refresh(skill)
    return skill


@router.get("/my-skills", response_model=list[SkillResponse])
def get_my_skills(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """List all skills of the logged-in student."""
    student = _get_student_by_user(current_user, db)
    return db.query(SkillModel).filter(SkillModel.sid == student.sid).all()


@router.get("/student/{student_id}", response_model=list[SkillResponse])
def get_skills_by_student(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    
    student = db.query(StudentModel).filter(StudentModel.sid == student_id).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    return db.query(SkillModel).filter(SkillModel.sid == student_id).all()

@router.delete("/delete-skill/{skill_id}", status_code=200)
def delete_skill(
    skill_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Delete a skill. Only the owner can delete their skill."""
    student = _get_student_by_user(current_user, db)

    skill = db.query(SkillModel).filter(
        SkillModel.skill_id == skill_id,
        SkillModel.sid == student.sid,
    ).first()

    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found or not yours to delete")

    db.delete(skill)
    db.commit()
    return {"message": "Skill deleted successfully"}