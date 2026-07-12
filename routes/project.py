import cloudinary.uploader
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from database.database import get_db
from auth.auth import get_current_user
from models.basemodel import (
    Resume as ResumeModel,
    Student as StudentModel,
    Project as ProjectModel,
)
from schemas.pydantic_models import (
    ProjectCreate,
    ProjectUpdate,
    ProjectResponse,
    ResumeResponse,
)

router = APIRouter()



def _get_student_by_user(current_user: dict, db: Session) -> StudentModel:
    email = current_user.get("sub")
    student = db.query(StudentModel).filter(StudentModel.email == email).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")
    return student


# ── Resume endpoints ──────────────────────────────────────────────────────────

@router.post("/upload-resume", status_code=201)
def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Upload a resume (PDF/image) to Cloudinary and store the record."""
    student = _get_student_by_user(current_user, db)

    try:
        upload_data = cloudinary.uploader.upload(
            file.file,
            folder="resumes",
            resource_type="auto",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cloudinary upload failed: {str(e)}")

    resume = ResumeModel(
        sid=student.sid,
        public_id=upload_data["public_id"],
        file_name=upload_data.get("original_filename", file.filename),
        file_url=upload_data["secure_url"],
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)

    return {
        "message": "Resume uploaded successfully",
        "file_name": resume.file_name,
        "file_url": resume.file_url,
    }


@router.get("/my-resumes", response_model=list[ResumeResponse])
def get_my_resumes(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    
    student = _get_student_by_user(current_user, db)
    return db.query(ResumeModel).filter(ResumeModel.sid == student.sid).all()


@router.delete("/delete-resume/{r_id}", status_code=200)
def delete_resume(
    r_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):

    student = _get_student_by_user(current_user, db)

    resume = db.query(ResumeModel).filter(
        ResumeModel.r_id == r_id,
        ResumeModel.sid == student.sid,
    ).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found or not yours to delete")

    try:
        cloudinary.uploader.destroy(resume.public_id)
    except Exception:
        pass

    db.delete(resume)
    db.commit()
    return {"message": "Resume deleted successfully"}


# ── Project endpoints ─────────────────────────────────────────────────────────

@router.post("/add-project", response_model=ProjectResponse, status_code=201)
def add_project(
    payload: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Create a new project for the logged-in student."""
    student = _get_student_by_user(current_user, db)

    project = ProjectModel(sid=student.sid, title=payload.title, description=payload.description)
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@router.get("/my-projects", response_model=list[ProjectResponse])
def get_my_projects(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """List all projects owned by the logged-in student."""
    student = _get_student_by_user(current_user, db)
    return db.query(ProjectModel).filter(ProjectModel.sid == student.sid).all()


@router.get("/student/{student_id}", response_model=list[ProjectResponse])
def get_projects_by_student(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """List all projects for a specific student."""
    student = db.query(StudentModel).filter(StudentModel.sid == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return db.query(ProjectModel).filter(ProjectModel.sid == student_id).all()


@router.put("/update-project/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: int,
    payload: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Update a project. Only the owning student can update."""
    student = _get_student_by_user(current_user, db)

    project = db.query(ProjectModel).filter(
        ProjectModel.pid == project_id,
        ProjectModel.sid == student.sid,
    ).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found or not yours to update")

    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(project, key, value)

    db.commit()
    db.refresh(project)
    return project


@router.delete("/delete-project/{project_id}", status_code=200)
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Delete a project. Only the owning student can delete."""
    student = _get_student_by_user(current_user, db)

    project = db.query(ProjectModel).filter(
        ProjectModel.pid == project_id,
        ProjectModel.sid == student.sid,
    ).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found or not yours to delete")

    db.delete(project)
    db.commit()
    return {"message": "Project deleted successfully"}