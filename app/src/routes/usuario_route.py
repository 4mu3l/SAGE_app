from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import EmailStr
from src.models.usuario_model import Usuario as UsuarioModel
from src.schemas.usuario_schema import *
from src.services.usuario_service import *
from src.services.email_recup import enviar_email_recuperacao
from security import verificar_senha, criar_token_acesso
from dependedecies import pegar_sessao, verificar_token

router = APIRouter(prefix="/usuarios", tags=["Usuários"])

@router.post("/", tags=["Usuários"])
def cadastrar_usuario(user: UsuarioCreate, db: Session = Depends(pegar_sessao)):
    return criar_usuario(db, user)

@router.post("/solicitar-recuperacao", tags=["Usuários"])
def solicitar_recuperacao(
    request: EmailRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(pegar_sessao),
):
    usuario = db.query(UsuarioModel).filter(UsuarioModel.email == request.email).first()
    if usuario:
        codigo = gerar_codigo_recuperacao(db, request.email)
        background_tasks.add_task(enviar_email_recuperacao, request.email, codigo)

    return {"message": "Se o e-mail existir, um código de recuperação foi enviado."}

@router.post("/resetar-senha", tags=["Usuários"])
async def resetar_senha_route(request: ResetSenhaRequest, db: Session = Depends(pegar_sessao)):
    return resetar_senha(db, request.email, request.codigo, request.nova_senha)

@router.post("/login-social", tags=["Usuários"])
def login_social_route(provedor: str, token: str, db: Session = Depends(pegar_sessao)):
    return login_social(db, provedor, token)

@router.post("/login", tags=["Usuários"])
def login_tradicional_route(login: UsuarioLogin, db: Session = Depends(pegar_sessao)):
    return login_tradicional(db, login.email, login.senha)

@router.post("/token", include_in_schema=False)
def login_swagger_ui(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(pegar_sessao)):
    usuario = db.query(UsuarioModel).filter(UsuarioModel.email == form_data.username).first()
    if not usuario or not verificar_senha(form_data.password, usuario.senha):
        raise HTTPException(status_code=400, detail="E-mail ou senha incorretos")
    
    token = criar_token_acesso({"sub": str(usuario.id)})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/perfil/{usuario_id}", tags=["Usuários"])
def ver_perfil(usuario_id: int, db: Session = Depends(pegar_sessao), current_user: UsuarioModel = Depends(verificar_token)):
    return obter_perfil(db, usuario_id, current_user)

@router.patch("/perfil/{usuario_id}", tags=["Usuários"])
def editar_perfil_route(usuario_id: int, dadosN: UsuarioUpdate, db: Session = Depends(pegar_sessao), current_user: UsuarioModel = Depends(verificar_token)):
    return editar_perfil(db, usuario_id, dadosN, current_user)

@router.get("/", tags=["Usuários"])
def listar_usuarios_route(db: Session = Depends(pegar_sessao), current_user: UsuarioModel = Depends(verificar_token)):
    return listar_usuarios(db, current_user)

@router.delete("/{usuario_id}", tags=["Usuários"])
def deletar_usuario_route(usuario_id: int, confirmacao: UsuarioLogin, db: Session = Depends(pegar_sessao), current_user: UsuarioModel = Depends(verificar_token)):
    return deletar_usuario(db, usuario_id, confirmacao, current_user)
