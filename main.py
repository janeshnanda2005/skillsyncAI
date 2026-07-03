from fastapi import FastAPI
from routes.student import router as student_router
from routes.auth import router as user_router
from routes.skills import router as skills_router
from routes.certifications import router as certifications_router
from routes.project import router as project_router

from models.basemodel import Base
from database.database import engine


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title ="Skillsyncai",
    description="A platform to connect students with projects and skills",
    version="1.0.0"
)

@app.get("/")
def root():
    return {"message": "Welcome to Skillsyncai API"}


app.include_router(
    student_router,
    prefix="/students",
    tags=["students"]
)

app.include_router(
    user_router,
    prefix="/auth",
    tags=["auth"]
)

app.include_router(
    skills_router,
    prefix="/skills",
    tags=["skills"]
)

app.include_router(
    certifications_router,
    prefix="/certifications",
    tags=["certifications"]
)