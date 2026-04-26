from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from app.database import SessionLocal
from app.src.models.usuario_model import Usuario

from app.security import oauth2_schema, verificar_token_acesso

def pegar_sessao():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


def verificar_token(token: str = Depends(oauth2_schema), session: Session = Depends(pegar_sessao)):
    try:
        payload = verificar_token_acesso(token)
        id_usuario = int(payload.get("sub"))
    except JWTError:
        raise HTTPException(status_code=401, detail="Acesso negado")

    usuario = session.query(Usuario).filter(Usuario.id == id_usuario).first()
    if not usuario:
        raise HTTPException(status_code=401, detail="Acesso inválido")
    return usuario