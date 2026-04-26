from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Meta(Base):
    __tablename__ = "metas"

    id = Column("id", Integer, primary_key = True, autoincrement=True)
    local = Column(String, index=True)
    tipo_consumo = Column(String, index=True)
    quantidade_alvo = Column(Float)
    prazo = Column(Date)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    
    # Relacionamento
    usuario = relationship("Usuario", back_populates="metas")

    def __init__(self, tipo_consumo, quantidade_alvo, prazo, usuario_id=None):
        self.tipo_consumo = tipo_consumo
        self.quantidade_alvo = quantidade_alvo
        self.prazo = prazo
        self.usuario_id = usuario_id