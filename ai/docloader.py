from langchain_community.document_loaders import PyPDFLoader
from langchain_chroma import Chroma
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

api = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")



def establish_connection():
    conn = psycopg2.connect(
        host="localhost",
        port=5432,
        database="skillsyncai",
        user="postgres",
        password=DB_PASSWORD
    )

    cursor = conn.cursor()

    cursor.execute("""
        SELECT r_id, file_name, file_data
        FROM resumes
        WHERE r_id = %s
    """, (1,))

    result = cursor.fetchone()

    print("RESULT:", result is not None)

    if result is None:
        print("No resume found")
    else:
        r_id, file_name, file_data = result

        print("ID:", r_id)
        print("File name:", file_name)
        print("File size:", len(file_data))

    with open("document.pdf","wb") as f:
        f.write(file_data)

    cursor.close()
    conn.close()

if not api:
    print("GEMINI_API_KEY is missing. Retriever will not be initialized.")
else:
    retriever = None

    def embedding_documents():
        embedding = GoogleGenerativeAIEmbeddings(
            model="models/gemini-embedding-2",
            google_api_key=api
        )

        pdf = PyPDFLoader("document.pdf")

        splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )

        pdf_splitter = splitter.split_documents(pdf.load())

        persist_dir = "./chromadb"
        collection = "pdf_data"

        if not os.path.exists(persist_dir):
            os.makedirs(persist_dir)
        else:
            print("The Vector Store Exists")

        vectordb = None
        try:
            vectordb = Chroma.from_documents(   
                persist_directory=persist_dir,
                collection_name=collection,
                documents=pdf_splitter,
                embedding=embedding
            )
        except Exception as e:
            print(f"The Expection is {e}")

        if vectordb:
            global retriever
            retriever = vectordb.as_retriever(
                search_kwargs={"k":5},
                similarity="simiarity"
            )
            print("The Vector Database is initialized and the retriever will work")
        else:
            print("Vector database is not Initialized retriever will not be available")

if __name__ == "__main__":
    establish_connection()
    embedding_documents()