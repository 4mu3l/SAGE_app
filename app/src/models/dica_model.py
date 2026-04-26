from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

class Dica(Base):
    __tablename__ = "dicas"
    
    id = Column("id", Integer, primary_key=True, autoincrement=True)
    titulo = Column(String)
    descricao = Column(Text)
    tipo_consumo = Column(String, index=True)  # "agua", "luz", "combustivel"
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    data_criacao = Column(DateTime, default=datetime.now)
    
    # Relacionamento
    usuario = relationship("Usuario", backref="dicas")
    
    def __init__(self, titulo, descricao, tipo_consumo, usuario_id):
        self.titulo = titulo
        self.descricao = descricao
        self.tipo_consumo = tipo_consumo
        self.usuario_id = usuario_id
        self.data_criacao = datetime.now()

