from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from database.database import Session
from auth.auth import get_current_user
from schemas.pydantic_models import Resume


router = APIRouter()

@router.post("/upload-resume")
def upload_resume(file:UploadFile = File(...),current_user = Depends(get_current_user)):
    db = Session()

    upload_data = coludinary.uploader.upload(file.file,folder="resumes")

    resume = Resume(
        sid = current_user.sid, 
        public_id = upload_data["public_id"],
        file_name = upload_data["original_filename"],
        file_url = upload_data["secure_url"]
    )

    db.add(resume)
    db.commit()
    