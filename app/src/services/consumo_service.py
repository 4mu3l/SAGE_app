from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.src.models.consumo_model import Consumos
from app.src.schemas.consumo_schema import Consumo, ConsumoUpdate
from app.src.models.usuario_model import Usuario

def registrar_consumo(db: Session, novo_consumo: ConsumoCreate, current_user: Usuario):
    # O usuario_id é sempre definido automaticamente pelo ID do usuário autenticado
    usuario_id = current_user.id
    
    consumo_db = Consumos(
        tipo_consumo=novo_consumo.tipo_consumo,
        quantidade=novo_consumo.quantidade,
        unidade=novo_consumo.unidade,
        preco=novo_consumo.preco,
        data=novo_consumo.data,
        simulacao=novo_consumo.simulacao,
        usuario_id=usuario_id,
    )
    db.add(consumo_db)
    db.commit()
    db.refresh(consumo_db)
    return {"status": "Sucesso", "dados": consumo_db}

def listar_consumos(db: Session, current_user: Usuario, usuario_id: int = None):
    query = db.query(Consumos)
    if not current_user.admin:
        query = query.filter(Consumos.usuario_id == current_user.id)
    elif usuario_id:
        query = query.filter(Consumos.usuario_id == usuario_id)
    return query.all()

def get_consumo_by_id(db: Session, consumo_id: int, current_user: Usuario):
    consumo = db.query(Consumos).filter(Consumos.id == consumo_id).first()
    if not consumo:
        raise HTTPException(status_code=404, detail="Consumo não encontrado")
        
    if not current_user.admin and consumo.usuario_id != current_user.id:
        raise HTTPException(status_code=403, detail="Você não tem permissão para acessar este consumo.")
        
    return consumo

def update_consumo(db: Session, consumo_id: int, consumo_atualizado: ConsumoUpdate, current_user: Usuario):
    consumo = get_consumo_by_id(db, consumo_id, current_user)
    
    if not current_user.admin and consumo_atualizado.usuario_id is not None:
        consumo_atualizado.usuario_id = current_user.id
        
    if consumo_atualizado.tipo_consumo is not None:
        consumo.tipo_consumo = consumo_atualizado.tipo_consumo
    if consumo_atualizado.quantidade is not None:
        consumo.quantidade = consumo_atualizado.quantidade
    if consumo_atualizado.unidade is not None:
        consumo.unidade = consumo_atualizado.unidade
    if consumo_atualizado.preco is not None:
        consumo.preco = consumo_atualizado.preco
    if consumo_atualizado.data is not None:
        consumo.data = consumo_atualizado.data
    if consumo_atualizado.simulacao is not None:
        consumo.simulacao = consumo_atualizado.simulacao
    if consumo_atualizado.usuario_id is not None:
        consumo.usuario_id = consumo_atualizado.usuario_id
    db.commit()
    db.refresh(consumo)
    return {"status": "Atualizado com sucesso", "dados": consumo}

def delete_consumo(db: Session, consumo_id: int, current_user: Usuario):
    consumo = get_consumo_by_id(db, consumo_id, current_user)
    db.delete(consumo)
    db.commit()
    return {"status": "Consumo deletado com sucesso!"}
