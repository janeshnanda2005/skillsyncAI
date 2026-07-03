from pydantic import BaseModel
from typing import Optional

class Certification(BaseModel):
    cert_id:int
    sid:int
    title:str

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
    sid : optional[int] = None
    name : optional[str] = None
    dept : optional[str] = None
    email : optional[str] = None
    year : optional[int] = None
    cgpa : optional[float] = None
    domain : optional[str] = None


class Project(BaseModel):
    pid:int
    sid:int
    title:str
    description:str