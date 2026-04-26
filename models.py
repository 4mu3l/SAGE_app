from sqlalchemy import Column, Integer, String, Float, Boolean, Date
from database import Base

class UsuarioDB(Base):
    __tablename__ = "usuarios"
    id = Column(Integer, primary_key = True, index = True)
    Nome = Column(String)
    Email = Column(String, unique = True, index = True)
    Senha = Column (String)

class ConsumoDB(Base):
    __tablename__ = "consumos"
    id = Column(Integer, primary_key=True, index=True)
    tipo = Column(String, index=True)
    quantidade = Column(Float)
    unidade = Column(String)
    preco = Column(Float)
    data = Column(Date)
    simulado = Column(Boolean, default=False)

# Tabela de Metas
class MetaDB(Base):
    __tablename__ = "metas"

    id = Column(Integer, primary_key=True, index=True)
    tipo = Column(String, index=True)
    quantidade_alvo = Column(Float)
    prazo = Column(Date)