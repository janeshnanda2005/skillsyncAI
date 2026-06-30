from fastapi import FastAPI, Path,HTTPException
from fastapi.responses import JSONResponse
from database import session,engine
import database_models
from pydantic_models import Student,UpdateStudent,LoginRequest,GetStudent

app = FastAPI()

# def init_db():
#     db = session()

#     for sid,data in students.items():

#         existing = db.query(database_models.Student).filter(
#             database_models.Student.sid == sid
#         ).first()

#         if existing:
#             continue
        
#         db_student = database_models.Student(
#             sid = sid,
#             name = data["name"],
#             age = data["age"],
#             dept = data["dept"]
#         )

#         db.add(db_student)

#     db.commit()

# database_models.Base.metadata.create_all(bind=engine)
# init_db()

@app.get("/")
def index():
    return {"message": "Hello, World!"}

@app.get("/students")
def get_students():
    db = session()

    students = db.query(database_models.Student).all()

    db.close()

    return students

@app.get("/get_student/{student_id}")
def get_student(
    student_id: int = Path(
        ...,
        description="The ID of the student you want to view",
        gt=0
    )
):  
    db = session()
    db.query()
    if student_id not in students:
        return {"message": "Student not found"}

    return students[student_id]


@app.get("/primes/")
def primes(number: int):
    primes = []

    for i in range(2, number + 1):
        is_prime = True

        for j in range(2, i):
            if i % j == 0:
                is_prime = False
                break

        if is_prime:
            primes.append(i)

    return {"primes": primes}


@app.get("/get-by-student")
def get_student_values(
    name:str
):

    db = session()
    student = db.query(database_models.Student).filter(
        database_models.Student.name == name
    ).first()

    if student:
        return JSONResponse(
            status_code=200,
            content = {
                "sid":student.sid,
                "name":student.name,
                "age":student.age,
                "dept":student.dept
            }
        )

    return JSONResponse(
        status_code=401,
        content = {"message": "Student not found"}
        )


@app.post("/add-student")
def add_student(student:Student):


    db = session()

    existing = db.query(database_models.Student).filter(
        database_models.Student.sid == student.sid
    ).first()

    if existing:
        db.close()
        raise HTTPException(
            status_code=400,
            detail = "Student already exist"
        )


    db_student = database_models.Student(
        sid = student.sid,
        name = student.name,
        age = student.age,
        dept = student.dept
    )

    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    db.close()
    
    return {
        "message": "Student added",
    }

@app.put("/update-student")
def student_updation(student_id: int,student:UpdateStudent):

    db = session()

    existing = db.query(database_models.Student).filter(
        database_models.Student.sid == student_id
    ).first()

    if existing is None:
        db.close()
        raise HTTPException(
            status_code=400,
            detail = "Student is not found"
        )
    if student.name is not None:
        existing.name = student.name

    if student.age is not None:
        existing.age = student.age 
    
    if student.dept is not None:
        existing.dept = student.dept
    
    db.commit()
    db.refresh(existing)
    db.close()

    return {
        "message":"Student updated",
        "Student":existing
    }



@app.delete("/delete")
def del_func(student_id:int):
    db = session()

    value = db.query(database_models.Student).filter(
        database_models.Student.sid == student_id
    ).first()

    db.delete(value)
    db.commit()
    db.close()

    return {"message":"The data is deleted"}


@app.post("/login")
def login(data:LoginRequest):

    if data.username != "admin" or data.password !="1234":
        raise HTTPException(
            status_code = 401,
            detail="Invalid credentials"
        )

    token = createtoken.create_access_token({"sub":data.username})
    

    return {"access_token":token}
