from uuid import uuid4
from typing import TypedDict,Annotated,Sequence
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from langchain_core.messages import HumanMessage,AIMessage,BaseMessage
from langgraph.graph import StateGraph,START,END
from sqlalchemy.orm import Session
from ai.ai import take_action, call_llm , system_prompt,retriever_tool ,model_initalization,should_continue
from ai.ai import rag
from ai.main_docloader import embedding_documents
from pathlib import Path
from operator import add as add_messages
from database.database import get_db
from auth.auth import get_current_user
from models.basemodel import Resume, Student
from schemas.pydantic_models import ResumeResponse,ResumeUpdate,Resumegist

router = APIRouter()

class AgentState(TypedDict):
    messages : Annotated[Sequence[BaseMessage],add_messages]


@router.post("/gist-model",status_code=200)
async def resume_gist(
    resumeid:int,
    payload:Resumegist,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)):
    
    if payload is None:
        raise HTTPException("The payload is empty")
    
    resume = db.get(Resume).filter(Resume.r_id == resumeid).first()
    res = resume.file_data
    if not res:
        raise HTTPException(status_code=404,detail="Resume is not found")

    retriver = embedding_documents(res)

    llm = model_initalization()

    tools = [retriever_tool]

    llm = llm.bind_tools(tools=tools)

    tool_dict = {tool_instance.name : tool_instance for tool_instance in tools}


    graph = StateGraph(AgentState)
    graph.add_edge("llm",call_llm)
    graph.add_edge("retriever_agent",take_action)

    graph.add_conditional_edges(
        "llm",
        should_continue,
        {True:"retriever_agent",False:END}
    )

    graph.add_edge("retriever_agent","llm")
    graph.set_entry_point("llm")

    rag_agent = graph.compile()

    while True:
        user_input = payload.data 
        if user_input.lower() in ['quit','exit']:
            print("Thank you for your time with us!")
            break
        message = [HumanMessage(content=user_input)]
        res = rag_agent.invoke({"messages":message})
        response = res["message"][-1].content

        if isinstance(response,list):
            for item in response:
                if isinstance(item,dict) and "text" in item:
                    return item['text']
        else:
            return response




@router.post("/upload-resume",response_model=ResumeResponse,status_code=201)
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

