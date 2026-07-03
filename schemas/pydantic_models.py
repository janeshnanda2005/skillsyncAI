from pydantic import BaseModel
from typing import Optional

class Certification(BaseModel):
    cert_id:int
    sid:int
    title:str


class LoginRequest(BaseModel):
    email:str
    password:str 

class RegisterRequest(BaseModel):
    uid:int 
    name:str
    email:str
    password:str
    correct_password:str


class Skills(BaseModel):
    skill_id:int
    sid:int
    title:str

class Student(BaseModel):
    sid: int
    name: str
    dept: str
    email: str
    year:int
    cgpa:float
    domain:str


class Project(BaseModel):
    pid:int
    sid:int
    title:str
    description:str