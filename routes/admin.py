from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from models.basemodel import Admin as AdminModel
from schemas.pydantic_models import AdminCreate,AdminLogin,AdminResponse
from sqlalchemy.orm import Session
from database.database import get_db
from auth.auth import hash_password, verify_password, create_access_token
from models.basemodel import Admin
router = APIRouter()


@router.post("/register", response_model=AdminResponse, status_code=201)
def register_admin(payload: AdminCreate, db: Session = Depends(get_db)):
    """Register a new admin account."""
    if payload.password != payload.correct_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    existing = db.query(Admin).filter(Admin.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=409, detail="Admin with this email already exists")

    admin = Admin(
        name=payload.name,
        email=payload.email,
        password=hash_password(payload.password),
        created_at=datetime.now(timezone.utc),
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)
    return admin


@router.post("/login")
def login_admin(payload: AdminLogin, db: Session = Depends(get_db)):
    admin = db.query(Admin).filter(Admin.email == payload.email).first()
    if not admin or not verify_password(payload.password, admin.password):
        raise HTTPException(status_code=401, detail="invalid email or password")
    token = create_access_token(data={"sub": admin.email, "role": "admin"})
    return {"access_token": token, "token_type": "bearer"}
