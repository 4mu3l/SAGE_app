from pydantic import BaseModel
from typing import Optional
from datetime import date

class ConsumoBase(BaseModel):
    tipo_consumo: str
    quantidade: float
    unidade: str
    preco: float
    data: date
    simulacao: bool = False

class ConsumoCreate(ConsumoBase):
    pass

class Consumo(ConsumoBase):
    id: int
    usuario_id: int

class ConsumoUpdate(BaseModel):
    tipo_consumo: Optional[str] = None
    quantidade: Optional[float] = None
    unidade: Optional[str] = None
    preco: Optional[float] = None
    data: Optional[date] = None
    simulacao: Optional[bool] = None