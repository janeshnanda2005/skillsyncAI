from fastapi import APIRouter, Depends, HTTPException
from schemas.pydantic_models import LoginRequest, RegisterRequest
from sqlalchemy.orm import Session
from models.basemodel import User
from auth.auth import hash_password, verify_password, create_access_token, verify_token


router = APIRouter()

@router.post("/register")
def register_user(request: RegisterRequest):
    if request.password != request.correct_password:
        raise HTTPException(
            status_code = 400,
            detail = "passwords do not match"
        )

        hash_password = hash_password(request.password)

        db = Session()

        student_details = db.query(User).filter(User.email == request.email).first()

        db_student = User(
            uid = request.uid,
            name = request.name,
            email = request.email,
            password = hash_password,
            created_at = datatime.utcnow()
        )

        db.add(db_student)
        db.commit()
        db.close()


        return {"message":"User registered successfully"}


@router.post("/login")
def login_user(request:LoginRequest):
    db = Session()

    get_values = db.query(User).filter(User.email == request.email).first()

    if request.email != get_values.email or not verify_password(request.password,get_values.password):
        raise HTTPException(
            status_code = 401,
            detai = "Invalid email or password"
        )
    
    access_token = create_access_token(data = {"sub":get_values.email})

    db.close()

    return {"access_token":access_token,"token_type":"bearer"}


@router.get("/verify-token")
def verify_user_token(token:str = Depends(verify_token)):
    return {"message":"Token is valid"}


@router.post("/logout")
def logout_user():
    return {"message":"user logged out successfully"}

@router.get("/current-user")
def current_user(token:str = Depends(verify_token)):
    return {"message":"Current user details","user":token}




