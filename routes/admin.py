from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from models.basemodel import Admin as AdminModel
from schemas.pydantic_models import AdminCreate,AdminLogin,AdminResponse
from sqlalchemy.orm import Session
from database.database import get_db
from auth.auth import hash_password, verify_password, create_access_token
from models.basemodel import Admin
router = APIRouter()


@router.post("/register",response_model=AdminResponse,status_code=200)
def register_admin(payload:AdminCreate,db :Session = Depends(get_db)):
    if not payload:
        raise HTTPException(status_code=404,detail="The payload is empty")
    
    existing = db.query(Admin).filter(Admin.email == payload.email).first()
    if existing:
        raise HTTPException(detail="The User is already present",status_code=404)
    
    admin = Admin(
        name=payload.name,
        email = payload.email,
        password = payload.password,
        correct_password = payload.correct_password
    )

    db.add(admin)
    db.commit()
    db.refresh(admin)
    db.close()

    token = create_access_token(payload.password,admin.password)
    return {"access_token":token,"token_type":"bearer"}

@router.post("/login",status_code=401)
def login_admin(payload: AdminLogin, db: Session = Depends(get_db)):
    if not payload:
        raise HTTPException(detail="The Payload is Empty",status_code=400)
    admin = db.query(Admin).filter(Admin.email == payload.email).first()
    if not admin:
        raise HTTPException(detail="There is no admin payload",status_code=400)
    token = create_access_token(payload.password,admin.password)
    return {"access_token":token,"token_type": "bearer"}
