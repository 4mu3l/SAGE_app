from fastapi import HTTPException
from sqlalchemy.orm import Session
from src.models.metas_model import Meta as MetaModel
from src.models.consumo_model import Consumos
from src.schemas.metas_schema import Meta, MetaUpdate
from src.models.usuario_model import Usuario


def definir_meta(db: Session, nova_meta: Meta, current_user: Usuario):
    if not current_user.admin:
        nova_meta.usuario_id = current_user.id
        
    meta_db = MetaModel(
        tipo_consumo=nova_meta.tipo_consumo,
        quantidade_alvo=nova_meta.quantidade_alvo,
        prazo=nova_meta.prazo,
        usuario_id=nova_meta.usuario_id,
    )
    db.add(meta_db)
    db.commit()
    db.refresh(meta_db)
    return {"status": "Meta definida com sucesso!", "dados": meta_db}


def get_metas(db: Session, current_user: Usuario, usuario_id: int = None):
    query = db.query(MetaModel)
    if not current_user.admin:
        query = query.filter(MetaModel.usuario_id == current_user.id)
    elif usuario_id:
        query = query.filter(MetaModel.usuario_id == usuario_id)
    return query.all()


def get_meta_by_id(db: Session, meta_id: int, current_user: Usuario):
    meta = db.query(MetaModel).filter(MetaModel.id == meta_id).first()
    if not meta:
        raise HTTPException(status_code=404, detail="Meta não encontrada")
        
    if not current_user.admin and meta.usuario_id != current_user.id:
        raise HTTPException(status_code=403, detail="Você não tem permissão para acessar esta meta.")
        
    return meta


def update_meta(db: Session, meta_id: int, meta_atualizada: MetaUpdate, current_user: Usuario):
    meta = get_meta_by_id(db, meta_id, current_user)
    
    if not current_user.admin and meta_atualizada.usuario_id is not None:
        meta_atualizada.usuario_id = current_user.id
        
    if meta_atualizada.tipo_consumo is not None:
        meta.tipo_consumo = meta_atualizada.tipo_consumo
    if meta_atualizada.quantidade_alvo is not None:
        meta.quantidade_alvo = meta_atualizada.quantidade_alvo
    if meta_atualizada.prazo is not None:
        meta.prazo = meta_atualizada.prazo
    if meta_atualizada.usuario_id is not None:
        meta.usuario_id = meta_atualizada.usuario_id
    db.commit()
    db.refresh(meta)
    return {"status": "Meta atualizada com sucesso!", "dados": meta}


def delete_meta(db: Session, meta_id: int, current_user: Usuario):
    meta = get_meta_by_id(db, meta_id, current_user)
    db.delete(meta)
    db.commit()
    return {"status": "Meta deletada com sucesso!"}


def calcular_progresso(db: Session, tipo: str, current_user: Usuario):
    # Procura a meta específica para o usuário logado
    query_meta = db.query(MetaModel).filter(MetaModel.tipo_consumo.ilike(tipo))
    if not current_user.admin:
        query_meta = query_meta.filter(MetaModel.usuario_id == current_user.id)
    
    meta_atual = query_meta.first()
    
    if not meta_atual:
        raise HTTPException(status_code=404, detail=f"Nenhuma meta definida para {tipo}.")

    total_consumido = 0.0
    total_pago = 0.0
    
    # Busca os consumos considerando a meta e o usuário (se não for admin, pega só dele)
    query_consumos = db.query(Consumos).filter(
        Consumos.tipo_consumo.ilike(tipo),
        Consumos.simulacao == False,
    )
    if not current_user.admin:
        query_consumos = query_consumos.filter(Consumos.usuario_id == current_user.id)
        
    consumos = query_consumos.all()

    for c in consumos:
        total_consumido += c.quantidade
        total_pago += c.preco

    porcentagem = round((total_consumido / meta_atual.quantidade_alvo) * 100 if meta_atual.quantidade_alvo else 0, 1)
    custo_estimado_meta = 0.0
    if total_consumido > 0:
        preco_por_unidade = total_pago / total_consumido
        custo_estimado_meta = meta_atual.quantidade_alvo * preco_por_unidade

    return {
        "tipo": tipo,
        "progresso": {
            "quantidade_atual": total_consumido,
            "limite_meta": meta_atual.quantidade_alvo,
            "porcentagem": porcentagem,
        },
        "financeiro": {
            "total_pago_ate_agora": round(total_pago, 2),
            "estimativa_custo_na_meta": round(custo_estimado_meta, 2),
        },
        "alerta": "Cuidado! Meta ultrapassada!" if porcentagem > 100 else "Dentro do limite!"
    }
