from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.dependedecies import pegar_sessao, verificar_token
from app.src.models.usuario_model import Usuario
from app.ai.gemini_service import (
    gerar_dica_genérica,
    gerar_dica_personalizada,
    obter_ultimas_dicas
)

router = APIRouter(prefix="/dicas", tags=["Dicas"])


@router.get("/genérica")
def dica_genérica(
    tipo_consumo: str = None,
    db: Session = Depends(pegar_sessao),
    current_user: Usuario = Depends(verificar_token)
):
    """
    Gera uma dica genérica personalizada usando IA.
    
    **Parâmetros:**
    - `tipo_consumo` (opcional): "agua", "energia", etc
    
    **Exemplo:**
    ```
    GET /dicas/genérica?tipo_consumo=agua
    ```
    """
    return gerar_dica_genérica(db, current_user.id, tipo_consumo)


@router.get("/personalizada")
def dica_personalizada(
    db: Session = Depends(pegar_sessao),
    current_user: Usuario = Depends(verificar_token)
):
    """
    Gera uma dica personalizada analisando o histórico completo de consumo do usuário (últimos 30 dias).
    
    A IA analisa:
    - Consumo total por tipo
    - Média diária
    - Padrões de comportamento
    - Áreas de melhoria
    
    **Resposta incluirá:**
    - Dica específica baseada em seus dados
    - Análise com estatísticas completas
    """
    return gerar_dica_personalizada(db, current_user.id)


@router.get("/historico")
def historico_dicas(
    limite: int = 10,
    db: Session = Depends(pegar_sessao),
    current_user: Usuario = Depends(verificar_token)
):
    """
    Lista o histórico de dicas geradas para o usuário.
    
    **Parâmetros:**
    - `limite` (padrão: 10): Número máximo de dicas a retornar
    
    **Exemplo:**
    ```
    GET /dicas/historico?limite=5
    ```
    """
    dicas = obter_ultimas_dicas(db, current_user.id, limite)
    
    return {
        "status": "Sucesso",
        "total": len(dicas),
        "dicas": dicas
    }