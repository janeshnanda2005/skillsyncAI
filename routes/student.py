from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import session
from models.basemodel import Student
from schemas.pydantic_models import Item
from auth.auth import get_current_user

router = APIRouter()

@router.get("/get-student-details")
def student_details(student_id:int,current_user = Depends(get_current_user)):
    db = Session()

    student_details = db.query(Student).fetch(Student.sid == student_id).first()

    if not student_details:
        raise HTTPException(
            status_code = 404,
            detail = "Student not found"
        )
    
    student_data = {
        "sid":Student.sid,
        "name":Student.name,
        "email":Student.email,
        "cgpa":Student.cgpa,
        "created_at":Student.created_at
    }

    return Student_data

@route.post("/add-student")
def add_student(student:Student,current_user = Depends(get_current_user)):
    db = Session()

    db_student = Student(
        sid = student.sid,
        name = student.name,
        dept = student.dept,
        email = student.email,
        year = student.year,
        cgpa = student.cgpa,
        domain = student.domain,
        created_at = datetime.utcnow()
        )
    
    db.add(db_student)
    db.commit()
    db.close()

    return {"message":"Student added successfully"}


@router.put("/update-student")
def update_student(student_id:int,payload:Item,current_user = Depends(get_current_user)):
    db = Session()

    student_details = db.query(Student).filter(student.sid == student_id).first()

    if not student_details:
        raise HTTPException(
            status_code = 404,
            detail = "Student not found"
        )
    
    update_data = payload.model_dump(exclude_unset=True)

    for key,value in update_data.items():
        setattr(student_details,key,value)
    
    db.commit()
    db.refresh(student_details)
    db.close()

    return {"message":"Student details updated successfully","student":student_details}

