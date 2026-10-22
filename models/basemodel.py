from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, LargeBinary, text
from sqlalchemy.dialects.postgresql import JSONB 

Base = declarative_base()


class Student(Base):
    __tablename__ = "students"

    sid        = Column(Integer, primary_key=True, autoincrement=True)
    name       = Column(String(50), nullable=False)
    dept       = Column(String(10), nullable=False)
    email      = Column(String(50), unique=True, nullable=False)
    year       = Column(Integer, nullable=False)
    cgpa       = Column(Float, nullable=False)
    domain     = Column(String(50), nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=text("now()"))


class User(Base):
    __tablename__ = "users"

    uid = Column(Integer,primary_key = True,autoincrement=True)
    name = Column(String(50),nullable=False)
    email = Column(String(50),nullable=False,unique=True)
    password = Column(String(10000), nullable=True)
    created_at = Column(DateTime, nullable=False, server_default=text("now()"))


class Resume(Base):
    __tablename__ = "resumes"

    r_id      = Column(Integer, primary_key=True, autoincrement=True)
    sid       = Column(Integer, ForeignKey("students.sid", ondelete="CASCADE"), nullable=False)
    public_id = Column(String(100), nullable=False)
    file_name = Column(String(100), nullable=False)
    file_data  = Column(LargeBinary, nullable=False)


class Admin(Base):
    __tablename__ = "admin"

    aid        = Column(Integer, primary_key=True, autoincrement=True)
    name       = Column(String(50), nullable=False)
    email      = Column(String(50), unique=True, nullable=False)
    password   = Column(String(100), nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=text("now()"))


class Project(Base):
    __tablename__ = "projects"

    pid         = Column(Integer, primary_key=True, autoincrement=True)
    sid         = Column(Integer, ForeignKey("students.sid", ondelete="CASCADE"), nullable=False)
    title       = Column(String(100), nullable=False)
    description = Column(String(500), nullable=False)


class Skills(Base):
    __tablename__ = "skills"

    skill_id = Column(Integer, primary_key=True, autoincrement=True)
    sid      = Column(Integer, ForeignKey("students.sid", ondelete="CASCADE"), nullable=False)
    title    = Column(String(50), nullable=False)


class certification(Base):
    __tablename__ = "certifications"

    cert_id = Column(Integer, primary_key=True, autoincrement=True)
    sid     = Column(Integer, ForeignKey("students.sid", ondelete="CASCADE"), nullable=False)
    title   = Column(String(2000), nullable=False)


class Assesment(Base):
    __tablename__ = "assesment"

    assesment_id = Column(Integer,primary_key=True,autoincrement=True)
    title = Column(String(255),nullable=False)
    description = Column(String(2000),nullable=True)


class Question(Base):
    __tablename__ = "questions"

    question_id = Column(Integer,nullable=False,autoincrement=True,primary_key=True)
    assesment_id = Column(
        Integer,
        ForeignKey("assesment.assesment_id",ondelete="CASCADE"),
        nullable=False
    )

    question_text = Column(String(2000),nullable=False)
    options = Column(JSONB,nullable=False)
    correct_option_index = Column(Integer,nullable=False)

