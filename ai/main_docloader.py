from langchain_community.document_loaders import PyPDFLoader
from langchain_chroma import Chroma
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import os
import psycopg2
import tempfile
from dotenv import load_dotenv

load_dotenv()

api = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")

retriever = None

def embedding_documents(data):
    embedding = GoogleGenerativeAIEmbeddings(
            model="models/gemini-embedding-2",
            google_api_key=api
        )

    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as pdf_file:
        pdf_file.write(data)
        pdf_path = pdf_file.name

    try:
        pdf = PyPDFLoader(pdf_path)
        splitter = RecursiveCharacterTextSplitter(
                chunk_size=1000,
                chunk_overlap=200
        )
        pdf_splitter = splitter.split_documents(pdf.load())
    finally:
        os.unlink(pdf_path)

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
        print("The Vector Database is created")
    except Exception as e:
        print(f"The Expection is {e}")

    if vectordb:
        global retriever
        retriever = vectordb.as_retriever(
            search_kwargs={"k": 5},
            search_type="similarity"
        )
        print("The Vector Database is initialized and the retriever will work")
    else:
        print("Vector database is not Initialized retriever will not be available")
    return retriever
