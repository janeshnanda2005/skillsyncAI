from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean

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
    created_at = Column(DateTime, nullable=False, server_default="now()")


class User(Base):
    """Auth account — one per user. Linked to a Student via email."""
    __tablename__ = "users"

    uid        = Column(Integer, primary_key=True, autoincrement=True)
    name       = Column(String(50), nullable=False)
    email      = Column(String(50), unique=True, nullable=False)
    password   = Column(String(10000), nullable=False)
    created_at = Column(DateTime, nullable=False, server_default="now()")


class Resume(Base):
    __tablename__ = "resumes"

    r_id      = Column(Integer, primary_key=True, autoincrement=True)
    sid       = Column(Integer, ForeignKey("students.sid", ondelete="CASCADE"), nullable=False)
    public_id = Column(String(100), nullable=False)
    file_name = Column(String(100), nullable=False)
    file_url  = Column(String(300), nullable=False)


class Admin(Base):
    __tablename__ = "admin"

    aid        = Column(Integer, primary_key=True, autoincrement=True)
    name       = Column(String(50), nullable=False)
    email      = Column(String(50), unique=True, nullable=False)
    password   = Column(String(100), nullable=False)
    created_at = Column(DateTime, nullable=False, server_default="now()")


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
    title   = Column(String(50), nullable=False)
