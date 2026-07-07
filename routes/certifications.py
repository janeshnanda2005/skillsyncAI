from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.database import get_db
from auth.auth import get_current_user
from models.basemodel import certification as CertModel, Student as StudentModel
from schemas.pydantic_models import CertificationCreate, CertificationResponse

router = APIRouter()




def _get_student_by_user(current_user: dict, db: Session) -> StudentModel:
    email = current_user.get("sub")
    student = db.query(StudentModel).filter(StudentModel.email == email).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")
    return student



@router.post("/add-certification", response_model=CertificationResponse, status_code=201)
def add_certification(
    payload: CertificationCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Add a new certification for the logged-in student."""
    student = _get_student_by_user(current_user, db)

    existing = (
        db.query(CertModel)
        .filter(CertModel.sid == student.sid, CertModel.title == payload.title)
        .first()
    )
    if existing:
        raise HTTPException(status_code=409, detail="Certification already exists for this student")

    cert = CertModel(sid=student.sid, title=payload.title)
    db.add(cert)
    db.commit()
    db.refresh(cert)
    return cert


@router.get("/my-certifications", response_model=list[CertificationResponse])
def get_my_certifications(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """List all certifications of the logged-in student."""
    student = _get_student_by_user(current_user, db)
    return db.query(CertModel).filter(CertModel.sid == student.sid).all()


@router.get("/student/{student_id}", response_model=list[CertificationResponse])
def get_certifications_by_student(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Get all certifications for a specific student by ID."""
    student = db.query(StudentModel).filter(StudentModel.sid == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return db.query(CertModel).filter(CertModel.sid == student_id).all()


@router.delete("/delete-certification/{cert_id}", status_code=200)
def delete_certification(
    cert_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Delete a certification. Only the owner can delete."""
    student = _get_student_by_user(current_user, db)

    cert = db.query(CertModel).filter(
        CertModel.cert_id == cert_id,
        CertModel.sid == student.sid,
    ).first()

    if not cert:
        raise HTTPException(status_code=404, detail="Certification not found or not yours to delete")

    db.delete(cert)
    db.commit()
    return {"message": "Certification deleted successfully"}