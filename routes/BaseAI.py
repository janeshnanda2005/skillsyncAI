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
    db : Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    if not payload.msg.strip():
        raise HTTPException(status_code=404,detail="The Payload is Empty")

    student = db.query(Student).filter(Student.email == current_user.get("sub")).first()
    if not student:
        raise HTTPException(status_code=404,detail="Student Profile is not found")

    resume_query = db.query(Resume).filter(
    Resume.sid == student.sid).first()

    if not resume_query:
        raise HTTPException(status_code=404,detail="File data is not present")

    retriever = embedding_documents(resume_query.file_data)
    if retriever is None:
        raise HTTPException(status_code=503,detail="Resume retriever is unavailable")

    llm = model_initalization()
    if llm is None:
        raise HTTPException(status_code=503,detail="LLM is not availale at the moment")

    documents = retriever.invoke(payload.msg)
    print("Document ccount ",len(documents))
    context = "\n\n".join(doc.page_content for doc in documents)
    message = [
        SystemMessage(content=system_prompt),
        HumanMessage(
            content=(
                f"Resume Context: \n{context}\n\n"
                f"Question:{payload.msg}"
            )
        )
    ]
    response = llm.invoke(message)
    cleaned = _clean_ai_content(response.content)
    return cleaned
    