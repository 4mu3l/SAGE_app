from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DicaBase(BaseModel):
    titulo: str
    descricao: str
    tipo_consumo: str

class DicaCreate(DicaBase):
    usuario_id: int

class Dica(DicaBase):
    id: int
    usuario_id: int
    data_criacao: datetime

    class Config:
        orm_mode = True
