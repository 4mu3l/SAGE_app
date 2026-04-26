from pydantic import BaseModel
from typing import Optional
from datetime import date

class MetaBase(BaseModel):
    tipo_consumo: str
    quantidade_alvo: float
    prazo: date
    usuario_id: Optional[int] = None

class Meta(MetaBase):
    id: Optional[int] = None

class MetaCreate(MetaBase):
    pass

class MetaUpdate(BaseModel):
    tipo_consumo: Optional[str] = None
    quantidade_alvo: Optional[float] = None
    prazo: Optional[date] = None
    usuario_id: Optional[int] = None