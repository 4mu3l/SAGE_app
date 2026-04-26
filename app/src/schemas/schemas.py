from pydantic import BaseModel
from typing import Optional
from datetime import date

class Usuario(BaseModel):
    id: Optional[int] = None
    nome: str
    email: str
    senha: str
    ativo: bool = False
    admin: bool = False

    class Config:
        orm_mode = True

class Consumo(BaseModel):
    id: Optional[int] = None
    tipo_consumo: str  
    quantidade: float
    unidade: str 
    preco: float 
    data: date
    simulacao: bool = False
    usuario_id: int

    class Config:
        orm_mode = True


