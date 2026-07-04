from dotenv import load_dotenv
import os
import clodinary

load_dotenv()

cloudinary.config(
    cloud_name = os.get_env("CLOUDINARY_CLOUD_NAME"),
    api_key = os.get_env("CLOUDINARY_API_KEY"),
    api_secret = os.get_env("CLOUDINARY_API_SECRET"),
    secure = True
)