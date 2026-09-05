from uuid import uuid4

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from database.database import get_db
from auth.auth import get_current_user
from models.basemodel import Resume, Student
from schemas.pydantic_models import ResumeResponse,ResumeUpdate

router = APIRouter()

@router.post('/upload-resume', response_model=ResumeResponse, status_code=201)
async def add_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    email = current_user.get("sub")
    student = db.query(Student).filter(Student.email == email).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")

    existing = db.query(Resume).filter(Resume.sid == student.sid).first()
    if existing:
        raise HTTPException(status_code=409, detail="Resume already exists for the student")

    file_data = await file.read()

    res = Resume(
        sid=student.sid,
        public_id=f"resume-{uuid4().hex}",
        file_name=file.filename or "resume.pdf",
        file_data=file_data,
    )
    db.add(res)
    db.commit()
    db.refresh(res)
    return res

@router.put("/update-student",response_model=ResumeResponse,status_code=200)
def update_resume(
    student_id:int,
    payload:ResumeUpdate,
    db:Session = Depends(get_db),
    current_user:dict = Depends(get_current_user)):

    res = db.query(Resume).filter(Resume.sid == student_id).filter()
    if not res:
        raise HTTPException(status_code=401,detail="Student is not found")
    
    update_data = payload.model_dump(exclude_unset=True)
    for key,value in update_data.items():
        setattr(student,key,value)
    
    db.commit()
    db.refresh(res)
    return res

