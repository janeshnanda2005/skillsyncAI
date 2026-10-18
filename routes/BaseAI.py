from fastapi import APIRouter,Depends,HTTPException,Query
from sqlalchemy.orm import Session
from langchain_core.messages import HumanMessage,SystemMessage
from auth.auth import get_current_user
from database.database import get_db
from schemas.pydantic_models import Resumegist
from models.basemodel import Resume,Student
from ai.ai import model_initalization,system_prompt
from ai.main_docloader import embedding_documents
import re

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

    text = re.sub(r"```(?:markdown|md)?\s*", "", text, flags=re.IGNORECASE)
    text = text.replace("```", "")
    lines = [re.sub(r"[ \t]+", " ", line).strip() for line in text.splitlines()]
    return "\n".join(lines).strip()


@router.post("/ai-chat",status_code=200)
async def resume_gist(
    payload:Resumegist,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):

    if not payload:
        raise HTTPException(detail="Data is not found",status_code=401)
    
    student = db.query(Student).filter(Student.email == current_user.get("sub")).first()

    if not student:
        raise HTTPException(detail="The student data is not present",status_code=401)
    
    resume_query = db.query(Resume).filter(Resume.sid == Student.sid).first()

    if not resume_query:
        raise HTTPException(detail="Resume if not present",status_code=401)
    
    retriever = embedding_documents(resume_query.file_data)
    if not retriever:
        raise HTTPException(detail="The retriver is not",status_code=400)
    
    llm = model_initalization()
    if not llm:
        raise HTTPException(detail="The LLM is not present",status_code=400)
    
    documents = retriever.invoke(payload.msg)
    context = "\n\n".join(doc.page_content for doc in documents)
    message = [
        SystemMessage(content=system_prompt),
        HumanMessage(
            content=(
                f"Resume Context: \n{Context}\n\n"
                f"Question:{payload.msg}"
            )
        )
    ]

    response = llm.invoke(message)
    cleaned = _clean_ai_content(response.content)
    return cleaned