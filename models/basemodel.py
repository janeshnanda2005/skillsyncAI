from sqlalchemy.orm import declarative_base
from sqlalchemy import Column,Integer,String,Float,DateTime,ForeignKey

Base = declarative_base()

class Student(Base):
    __tablename__ = "students"

    sid = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False)
    dept = Column(String(10), nullable=False)
    email = Column(String(50),unique=True,nullable=False)
    year = Column(Integer,nullable=False)
    cgpa = Column(Float,nullable=False)
    domain = Column(String(50),nullable=False)
    created_at = Column(DateTime,nullable=False,server_default="now()")

class User(Base):
    __tablename__ = "users"

    uid = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False)
    email = Column(String(50),unique=True,nullable=False)
    password = Column(String(100),nullable=False)
    created_at = Column(DateTime,nullable=False,server_default="now()")

class Admin(Base):
    __tablename__ = "admin"

    aid = Column(Integer,primary_key=True)
    name = Column(String(50),nullable=False)
    email = Column(String(50),unique=True,nullable=False)
    password = Column(String(100),nullable=False)
    created_at = Column(Datetime,nullable=False,server_default="now()")

class Project(Base):
    __tablename__ = "projects"

    pid = Column(Integer, primary_key=True)
    sid = Column(Integer, ForeignKey("students.sid"), nullable=False)
    title = Column(String(100),nullable=False)
    description = Column(String(500),nullable=False)

class Skills(Base):
    
    __tablename__ = "skills"

    
    skill_id = Column(Integer,primary_key = True)
    sid = Column(Integer,ForeignKey("students.sid"),nullable=False)
    title = Column(String(50),nullable=False)

class certification(Base):

    __tablename__ = "certifications"

    
    cert_id = Column(Integer,primary_key = True)
    sid = Column(Integer,ForeignKey("students.sid"),nullable=False)
    title = Column(String(50),nullable=False) 
