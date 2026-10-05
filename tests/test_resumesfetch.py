import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()

def establish_resume():
    database_url = os.getenv("DATABASE_URL")

    replace = database_url.replace(
        "postgresql+psycopg2://",
        "postgresql://"
    )

    conn = psycopg2.connect(replace)

    cursor = conn.cursor()

    cursor.execute("""
    SELECT resumes.sid FROM resumes LEFT JOIN students on students.sid = resumes.sid
    """,)

    result = cursor.fetchone()
    print("Result",result[0])

establish_resume()