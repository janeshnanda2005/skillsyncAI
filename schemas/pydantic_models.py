from pydantic import BaseModel
from typing import Optional

class Certification(BaseModel):
    cert_id:int
    sid:int
    title:str

class Resume(BaseModel):
    r_id:int
    sid:int
    public_id:str
    file_name:str
    file_url:str

class Item(BaseModel):
    title : Optional[str] = None
    description : Optional[str] = None
    price : Optional[float] = None

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
    sid : Optional[int] = None
    name : Optional[str] = None
    dept : Optional[str] = None
    email : Optional[str] = None
    year : Optional[int] = None
    cgpa : Optional[float] = None
    domain : Optional[str] = None


class Project(BaseModel):
    pid:int
    sid:int
    title:str
    description:str