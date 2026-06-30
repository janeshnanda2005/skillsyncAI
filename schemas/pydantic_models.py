from pydantic import BaseModel
from typing import Optional

class UpdateStudent(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    dept:Optional[str] = None

class GetStudent(BaseModel):
    name : Optional[str] = None

class Student(BaseModel):
    sid: int
    name: str
    age: int
    dept: str

class LoginRequest(BaseModel):
    username:str
    password:str