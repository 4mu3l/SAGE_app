from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.src.schemas.consumo_schema import Consumo, ConsumoUpdate
from app.src.services.consumo_service import *
from app.dependedecies import pegar_sessao, verificar_token

from app.src.models.usuario_model import Usuario

router = APIRouter(prefix="/consumo", tags=["Consumo"])

@router.post("/", tags=["Consumo"])
def registrar_consumo_route(novo_consumo: Consumo, 
                            session: Session = Depends(pegar_sessao), 
                            current_user: Usuario = Depends(verificar_token)):
    return registrar_consumo(session, novo_consumo, current_user)

@router.get("/", tags=["Consumo"])
def listar_consumos_route(usuario_id: int = None, session: Session = Depends(pegar_sessao), current_user: Usuario = Depends(verificar_token)):
    return listar_consumos(session, current_user, usuario_id)

@router.get("/{consumo_id}", tags=["Consumo"])
def obter_consumo_route(consumo_id: int, session: Session = Depends(pegar_sessao), current_user: Usuario = Depends(verificar_token)):
    return get_consumo_by_id(session, consumo_id, current_user)

@router.patch("/{consumo_id}", tags=["Consumo"])
def atualizar_consumo_route(consumo_id: int, consumo_atualizado: ConsumoUpdate, session: Session = Depends(pegar_sessao), current_user: Usuario = Depends(verificar_token)):
    return update_consumo(session, consumo_id, consumo_atualizado, current_user)

@router.delete("/{consumo_id}", tags=["Consumo"])
def deletar_consumo_route(consumo_id: int, session: Session = Depends(pegar_sessao), current_user: Usuario = Depends(verificar_token)):
    return delete_consumo(session, consumo_id, current_user)