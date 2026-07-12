from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi import HTTPException, Depends
from dotenv import load_dotenv
from fastapi.security import OAuth2PasswordBearer
import os
import bcrypt
from passlib.hash import pbkdf2_sha256


load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


def hash_password(password: str):
    return pbkdf2_sha256.hash(password)


def verify_password(plain_password: str, hashed_password: str):
    if hashed_password.startswith(("$2a$", "$2b$", "$2y$", "$2x$")):
        try:
            return bcrypt.checkpw(
                plain_password.encode("utf-8"),
                hashed_password.encode("utf-8"),
            )
        except ValueError:
            return False

    return pbkdf2_sha256.verify(plain_password, hashed_password)


def create_access_token(data: dict):
    payload = data.copy()

    payload['exp'] = datetime.utcnow()+timedelta(minutes=int(ACCESS_TOKEN_EXPIRE_MINUTES))

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


def verify_token(token: str):

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        username = payload.get("sub")

        if username is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

        return payload

    except JWTError:

        raise HTTPException(
            status_code=401,
            detail="Token expired or invalid"
        )


def get_current_user(
    token: str = Depends(oauth2_scheme)
):
    return verify_token(token)