from fastapi import APIRouter, Depends, HTTPException
from schmemas.pydantic_models import LoginRequest, RegisterRequest
from auth.auth import hash_password, verify_password, create_access_token, verify_token


router = APIRouter()

@router.post("/register")
def register_user(request: RegisterRequest):
    if request.password != request.correct_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    
    hashed_password = hash_password(request.password)
    
    # Here you would typically save the user to the database
    # For example:
    # new_user = User(name=request.name, email=request.email, password=hashed_password)
    # db_session.add(new_user)
    # db_session.commit()
    
    return {"message": "User registered successfully"}