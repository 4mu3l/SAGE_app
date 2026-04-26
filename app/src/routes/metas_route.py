from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.schemas.metas_schema import Meta, MetaUpdate
from src.services.metas_service import *
from dependedecies import pegar_sessao, verificar_token
from src.models.usuario_model import Usuario

router = APIRouter(prefix="/metas", tags=["Metas"])

@router.post("/", tags=["Metas"])
def definir_meta_route(nova_meta: Meta, db: Session = Depends(pegar_sessao), current_user: Usuario = Depends(verificar_token)):
    return definir_meta(db, nova_meta, current_user)

@router.get("/", tags=["Metas"])
def listar_metas_route(usuario_id: int = None, db: Session = Depends(pegar_sessao), current_user: Usuario = Depends(verificar_token)):
    return get_metas(db, current_user, usuario_id)

@router.get("/{meta_id}", tags=["Metas"])
def obter_meta_route(meta_id: int, db: Session = Depends(pegar_sessao), current_user: Usuario = Depends(verificar_token)):
    return get_meta_by_id(db, meta_id, current_user)

@router.patch("/{meta_id}", tags=["Metas"])
def atualizar_meta_route(meta_id: int, meta_atualizada: MetaUpdate, db: Session = Depends(pegar_sessao), current_user: Usuario = Depends(verificar_token)):
    return update_meta(db, meta_id, meta_atualizada, current_user)

@router.delete("/{meta_id}", tags=["Metas"])
def deletar_meta_route(meta_id: int, db: Session = Depends(pegar_sessao), current_user: Usuario = Depends(verificar_token)):
    return delete_meta(db, meta_id, current_user)

@router.get("/progresso/{tipo}", tags=["Metas"])
def calcular_progresso_route(tipo: str, db: Session = Depends(pegar_sessao), current_user: Usuario = Depends(verificar_token)):
    return calcular_progresso(db, tipo, current_user)
