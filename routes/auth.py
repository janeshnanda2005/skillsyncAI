from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.database import get_db
from models.basemodel import User
from auth.auth import hash_password, verify_password, create_access_token, verify_token, get_current_user
from schemas.pydantic_models import LoginRequest, RegisterRequest, TokenResponse

router = APIRouter()


@router.post("/register", status_code=201)
def register_user(request: RegisterRequest, db: Session = Depends(get_db)):
    """Register a new user account."""
    if request.password != request.correct_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    existing = db.query(User).filter(User.email == request.email).first()
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")

    db_user = User(
        name=request.name,
        email=request.email,
        password=hash_password(request.password),
        created_at=datetime.utcnow(),
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return {"message": "User registered successfully", "email": db_user.email}


@router.post("/login", response_model=TokenResponse)
def login_user(request: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate a user and return a JWT access token."""
    user = db.query(User).filter(User.email == request.email).first()

    if not user or not verify_password(request.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/verify-token")
def verify_user_token(current_user: dict = Depends(get_current_user)):
    """Check if the provided Bearer token is valid."""
    return {"message": "Token is valid", "user": current_user.get("sub")}


@router.post("/logout")
def logout_user():
    """
    Logout endpoint. Since JWTs are stateless, actual invalidation requires
    a token blacklist. For now this signals the client to discard the token.
    """
    return {"message": "Logged out successfully. Please discard your token on the client."}


@router.get("/current-user")
def current_user(current_user: dict = Depends(get_current_user)):
    """Return the currently authenticated user's email from the token."""
    return {"user": current_user.get("sub")}
