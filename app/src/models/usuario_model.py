from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column("id", Integer, primary_key = True, autoincrement=True)
    nome = Column("nome", String)
    email = Column("email", String, nullable=False)
    senha = Column("senha", String)
    ativo = Column("ativo", Boolean)
    admin = Column("admin", Boolean, default=False)
    codigo_recuperacao = Column("codigo_recuperacao", String, nullable=True)
    
    # Relacionamentos
    consumos = relationship("Consumos", back_populates="usuario", cascade="all, delete-orphan")
    metas = relationship("Meta", back_populates="usuario", cascade="all, delete-orphan")

    def __init__(self, nome, email, senha, ativo=False, admin=False):
        self.nome = nome
        self.email = email
        self.senha = senha
        self.ativo = ativo
        self.admin = admin