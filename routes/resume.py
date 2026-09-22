from uuid import uuid4
import re
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from langchain_core.messages import HumanMessage, SystemMessage
from sqlalchemy.orm import Session
from ai.ai import model_initalization, system_prompt
from ai.main_docloader import embedding_documents
from database.database import get_db
from auth.auth import get_current_user
from models.basemodel import Resume, Student
from schemas.pydantic_models import ResumeResponse,ResumeUpdate,Resumegist

router = APIRouter()


def _clean_ai_content(content) -> str:
    if isinstance(content, str):
        text = content
    elif isinstance(content, dict):
        text = content.get("text", content.get("content", ""))
        return _clean_ai_content(text)
    elif isinstance(content, list):
        text = "\n".join(
            _clean_ai_content(item) for item in content
            if isinstance(item, (str, dict, list))
        )
    else:
        text = str(content)

    text = re.sub(r"```(?:\w+)?", "", text)
    text = re.sub(r"(^|\n)\s*#{1,6}\s*", r"\1", text)
    text = re.sub(r"(^|\n)\s*[-*+]\s+", r"\1", text)
    text = re.sub(r"\*{1,3}|_{1,3}", "", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


@router.post("/gist-model",status_code=200)
async def resume_gist(
    resumeid:int,
    payload:Resumegist,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)):

    if not payload.msg.strip():
        raise HTTPException(status_code=400, detail="The payload is empty")

    resume = db.query(Resume).filter(Resume.r_id == resumeid).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume is not found")

    if not resume.file_data:
        raise HTTPException(status_code=404, detail="file_data is not found")

    retriever = embedding_documents(resume.file_data)
    if retriever is None:
        raise HTTPException(status_code=503, detail="Resume retriever is unavailable")

    llm = model_initalization()
    if llm is None:
        raise HTTPException(status_code=503, detail="AI model is unavailable")

    documents = retriever.invoke(payload.msg)
    context = "\n\n".join(document.page_content for document in documents)
    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(
            content=(
                f"Resume context:\n{context}\n\n"
                f"Question: {payload.msg}"
            )
        ),
    ]

    response = llm.invoke(messages)
    return _clean_ai_content(response.content)




@router.post("/upload-resume",response_model = ResumeResponse,status_code = 201)
async def add_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed"
        )

    email = current_user.get("sub")

    student = db.query(Student).filter(
        Student.email == email
    ).first()

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student profile not found"
        )

    existing = db.query(Resume).filter(
        Resume.sid == student.sid
    ).first()

    if existing:
        raise HTTPException(
            status_code=409,
            detail="Resume already exists for the student"
        )

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

@router.put("/update-resume",response_model=ResumeResponse,status_code=200)
def update_resume(
    student_id:int,
    payload:ResumeUpdate,
    db:Session = Depends(get_db),
    current_user:dict = Depends(get_current_user)):

    res = db.query(Resume).filter(Resume.sid == student_id).first()
    if not res:
        raise HTTPException(status_code=404,detail="Resume not found")
    
    update_data = payload.model_dump(exclude_unset=True)
    for key,value in update_data.items():
        setattr(res,key,value)
    
    db.commit()
    db.refresh(res)
    return res

