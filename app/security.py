from datetime import datetime, timedelta
from typing import Optional
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "23919401-1669-4603-9afb-7e9eb50849d0")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_MIN", "15"))

oauth2_schema = OAuth2PasswordBearer(tokenUrl="usuarios/token")

ph = PasswordHasher()

def gerar_senha(senha: str):
    """Gera um hash super seguro usando Argon2."""
    return ph.hash(senha)

def verificar_senha(senha_pura: str, senha_hash: str):
    """Compara a senha digitada com o hash Argon2 do banco de dados."""
    try:
        return ph.verify(senha_hash, senha_pura)
    except VerifyMismatchError:
        return False

def criar_token_acesso(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verificar_token_acesso(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError as exc:
        raise exc
