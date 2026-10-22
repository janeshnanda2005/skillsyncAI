from models.basemodel import Question,Assesment
from fastapi import APIRouter,Depends,HTTPException
from schemas.pydantic_models import Assesment_create,QuestionCreate,Assesment_Submisson
from sqlalchemy.orm import Session
from database.database import get_db
import json
from auth.auth import get_current_user


router = APIRouter()

@router.post("/assesments/",response_model=Assesment_create,status_code=201)
def assesment_create(data:Assesment_create,db:Session = Depends(get_db)):
    assesment = Assesment(title=data.title,description=data.description)

    if not assesment:
        raise HTTPException(detail="the data could not be added",status_code=404)
    
    db.add(assesment)
    db.flush

    for q in data.question:
        question = Question(
            assesment_id = assesment.assesment_id,
            question_text = q.question_text,
            options = q.question_options,
            correct_option_index = q.correct_option_index
        )

        db.add(question)
    
    db.commit()

    return data


@router.get("/assesments/{assesment_id}")
def get_assesment(assesment_id:int,db:Session = Depends(get_db)):
    assesment = db.get(Assesment,assesment_id)

    if not assesment:
        raise HTTPException(detail="Assesment is not Found",status_code=404)
    
    questions = db.exec(Questions).where(Question.assesment_id == assesment_id).all()

    safe_questions = [
        {
            "id":q.id,
            "question_text":q.question_text,
            "options":json.loads(q.options)
        }
        for q in questions
    ]

    return {
        "id":assesment.assesment_id,
        "title":assesment.title,
        "description":assesment.description,
        "questions":safe_questions
    }

router.post("/assesments/submit",status_code=200)
def submit_assesment(Submission:Assesment_Submisson,db:Session=Depends(get_db)):
    questions = db.exec(
        select(Question).where(Question.assesment_id == submission.assesment_id)
    ).all()


    if not question:
        raise HTTPException(status_code=404,detail="Assesment not found")

    score = 0
    total = len(questions)
    for i,q in enumerate(questions):
        if i < len(submission.select_answers) and submission.select_answers[i] == q.correct_option_index:
            score+=1
    

    return {
        "score" : score,
        "total" : total,
        "percentage": (score/total)*100 if total > 0 else 0
    }
