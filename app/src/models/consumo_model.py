from sqlalchemy import Column, Integer, String, Float, Boolean, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Consumos(Base):
    __tablename__ = "consumos"
    id = Column("id", Integer, primary_key = True, autoincrement=True)
    tipo_consumo = Column(String, index=True)
    quantidade = Column(Float)
    unidade = Column(String)
    preco = Column(Float)
    data = Column(Date)
    simulacao = Column(Boolean, default=False)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    
    # Relacionamento
    usuario = relationship("Usuario", back_populates = "consumos")

    def __init__(self, tipo_consumo, quantidade, unidade, preco, data, simulacao=False, usuario_id=None):
        self.tipo_consumo = tipo_consumo
        self.quantidade = quantidade
        self.unidade = unidade
        self.preco = preco
        self.data = data
        self.simulacao = simulacao
        self.usuario_id = usuario_id