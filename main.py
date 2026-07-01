from fastapi import FastAPI
from routes.student import student_router
from routes.user import user_router

app = FastAPI(
    title ="Skillsyncai",
    description="A platform to connect students with projects and skills",
    version="1.0.0"
)

@app.get("/")
def root():
    return {"message": "Welcome to Skillsyncai API"}


app.include_router(student_router, prefix="/students", tags=["Students"])
app.include_router(user_router, prefix="/users", tags=["Users"])

