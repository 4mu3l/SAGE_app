from sqlalchemy.orm import Session
from app.src.models.dica_model import Dica
from app.src.models.usuario_model import Usuario
from app.ai.gemini_service import (
    gerar_dica_genérica,
    gerar_dica_personalizada,
    obter_ultimas_dicas,
    gerar_dica_apos_novo_consumo
)
from fastapi import HTTPException


def obter_dica_genérica(db: Session, usuario_id: int, tipo_consumo: str = None):
    """
    Obtém uma dica genérica para o usuário.
    """
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    return gerar_dica_genérica(db, usuario_id, tipo_consumo)


def obter_dica_personalizada(db: Session, usuario_id: int):
    """
    Obtém uma dica personalizada baseada no histórico de consumo.
    """
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    return gerar_dica_personalizada(db, usuario_id)


def listar_historico_dicas(db: Session, usuario_id: int, limite: int = 10):
    """
    Lista o histórico de dicas do usuário.
    """
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    dicas = db.query(Dica).filter(
        Dica.usuario_id == usuario_id
    ).order_by(Dica.data_criacao.desc()).limit(limite).all()
    
    return {
        "status": "Sucesso",
        "total": len(dicas),
        "dicas": [
            {
                "id": dica.id,
                "titulo": dica.titulo,
                "dica": dica.descricao,
                "tipo": dica.tipo_consumo,
                "data": dica.data_criacao
            }
            for dica in dicas
        ]
    }


def obter_feedback_novo_consumo(db: Session, usuario_id: int, novo_consumo):
    """
    Obtém feedback/dica imediata após novo consumo.
    """
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    return gerar_dica_apos_novo_consumo(db, usuario_id, novo_consumo)
