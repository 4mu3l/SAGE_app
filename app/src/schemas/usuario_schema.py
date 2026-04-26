from pydantic import BaseModel, EmailStr
from typing import Optional

class UsuarioBase(BaseModel):
    nome: str
    email: EmailStr
    ativo: bool = False
    admin: bool = False

class Usuario(UsuarioBase):
    id: Optional[int] = None
    senha: str

class UsuarioCreate(UsuarioBase):
    senha: str

class UsuarioLogin(BaseModel):
    email: EmailStr
    senha: str

class EmailRequest(BaseModel):
    email: EmailStr

class ResetSenhaRequest(BaseModel):
    email: EmailStr
    codigo: str
    nova_senha: str

class UsuarioUpdate(BaseModel):
    nome: Optional[str] = None
    email: Optional[EmailStr] = None
    senha: Optional[str] = None
    ativo: Optional[bool] = None
    admin: Optional[bool] = None