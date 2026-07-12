from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.student import router as student_router
from routes.auth import router as auth_router
from routes.skills import router as skills_router
from routes.certifications import router as certifications_router
from routes.project import router as project_router
from routes.admin import router as admin_router

from models.basemodel import Base
from database.database import engine

import core.cloudify  # noqa: F401 – initialises Cloudinary config on startup

app = FastAPI(
    title="SkillSyncAI",
    description="A platform that syncs student skills, projects & certifications powered by AI.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def create_tables() -> None:
    Base.metadata.create_all(bind=engine)


@app.get("/", tags=["health"])
def root():
    return {"message": "Welcome to SkillSyncAI API 🚀", "docs": "/docs"}


app.include_router(auth_router,           prefix="/auth",           tags=["Auth"])
app.include_router(student_router,        prefix="/students",       tags=["Students"])
app.include_router(skills_router,         prefix="/skills",         tags=["Skills"])
app.include_router(certifications_router, prefix="/certifications", tags=["Certifications"])
app.include_router(project_router,        prefix="/projects",       tags=["Projects & Resumes"])
app.include_router(admin_router,          prefix="/admin",          tags=["Admin"])