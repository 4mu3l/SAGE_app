from datetime import timedelta
import random
import string
from sqlalchemy.orm import Session
from pydantic import EmailStr
from src.models.usuario_model import Usuario
from src.schemas.usuario_schema import UsuarioCreate, UsuarioUpdate, UsuarioLogin, ResetSenhaRequest, EmailRequest
from security import *
from fastapi import HTTPException
from src.services.email_recup import enviar_email_recuperacao


def criar_usuario(db: Session, usuario: UsuarioCreate):
    usuario_existente = db.query(Usuario).filter(Usuario.email == usuario.email).first()
    if usuario_existente:
        return {"status": "Erro", "mensagem": "Email já cadastrado!"}

    senha_hash = gerar_senha(usuario.senha)
    novo_usuario = Usuario(
        nome=usuario.nome,
        email=usuario.email,
        senha=senha_hash,
        ativo=usuario.ativo,
        admin=usuario.admin
    )

    db.add(novo_usuario)
    db.commit()
    db.refresh(novo_usuario)

    return {
        "status": "Sucesso",
        "mensagem": f"Usuário {usuario.nome} cadastrado!",
        "usuario": {
            "id": novo_usuario.id,
            "nome": novo_usuario.nome,
            "email": novo_usuario.email,
            "ativo": novo_usuario.ativo,
            "admin": novo_usuario.admin,
        },
    }


def gerar_codigo_recuperacao(db: Session, email: EmailStr) -> str:
    codigo = ''.join(random.choices(string.digits, k=6))
    usuario = db.query(Usuario).filter(Usuario.email == email).first()
    if usuario:
        usuario.codigo_recuperacao = codigo
        db.commit()
    return codigo


def resetar_senha(db: Session, email: str, codigo: str, nova_senha: str):
    if not codigo or not nova_senha or not email:
        return {"status": "Erro", "mensagem": "E-mail, código e nova senha são obrigatórios."}

    usuario = db.query(Usuario).filter(Usuario.email == email).first()
    if not usuario:
        return {"status": "Erro", "mensagem": "Usuário não encontrado."}

    if not usuario.codigo_recuperacao or usuario.codigo_recuperacao != codigo:
        return {"status": "Erro", "mensagem": "Código inválido ou já utilizado."}

    usuario.senha = gerar_senha(nova_senha)
    usuario.codigo_recuperacao = None  # Limpa o código para que não possa ser reusado
    db.commit()
    db.refresh(usuario)
    return {"status": "Sucesso", "mensagem": "Senha atualizada com sucesso!"}


def login_social(db: Session, provedor: str, token: str):
    if token:
        return {
            "status": "Sucesso",
            "mensagem": f"Login via {provedor} realizado com sucesso!",
            "token_acesso": "jwt_token_gerado_pela_api"
        }
    return {"status": "Erro", "mensagem": "Falha na autenticação social"}


def login_tradicional(db: Session, email: str, senha: str):
    usuario = db.query(Usuario).filter(Usuario.email == email).first()
    if usuario and verificar_senha(senha, usuario.senha):
        token = criar_token_acesso({"sub": str(usuario.id)})
        return {
            "status": "Sucesso",
            "mensagem": f"Login tradicional para {email} realizado com sucesso!",
            "token_acesso": token
        }
    return {"status": "Erro", "mensagem": "E-mail ou senha incorretos!"}


def obter_perfil(db: Session, usuario_id: int, current_user: Usuario):
    if current_user.id != usuario_id and not current_user.admin:
        raise HTTPException(status_code=403, detail="Você não tem permissão para ver este perfil.")
        
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if usuario:
        return {
            "nome": usuario.nome,
            "email": usuario.email,
            "status": "Ativo" if usuario.ativo else "Inativo"
        }
    return {"status": "Erro", "mensagem": "Usuário não encontrado"}


def editar_perfil(db: Session, usuario_id: int, dados_atualizados: UsuarioUpdate, current_user: Usuario):
    # Regra: Ninguém pode editar o perfil de outra pessoa, nem mesmo o admin.
    if current_user.id != usuario_id:
        raise HTTPException(status_code=403, detail="Você só pode editar o seu próprio perfil.")
        
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if usuario:
        if dados_atualizados.nome is not None:
            usuario.nome = dados_atualizados.nome
        if dados_atualizados.email is not None:
            usuario.email = dados_atualizados.email
        if dados_atualizados.senha is not None:
            usuario.senha = gerar_senha(dados_atualizados.senha)
        if dados_atualizados.ativo is not None:
            usuario.ativo = dados_atualizados.ativo
        
        # Apenas admin pode alterar a flag de admin
        if current_user.admin and dados_atualizados.admin is not None:
            usuario.admin = dados_atualizados.admin

        db.commit()
        db.refresh(usuario)
        return {"status": "Sucesso", "mensagem": "Perfil atualizado!"}
    return {"status": "Erro", "mensagem": "Usuário não encontrado"}


def listar_usuarios(db: Session, current_user: Usuario):
    if not current_user.admin:
        raise HTTPException(status_code=403, detail="Acesso negado. Apenas administradores podem listar os usuários.")
        
    usuarios = db.query(Usuario).all()
    return [
        {
            "id": u.id,
            "nome": u.nome,
            "email": u.email,
            "ativo": u.ativo,
            "admin": u.admin
        }
        for u in usuarios
    ]


def deletar_usuario(db: Session, usuario_id: int, confirmacao: UsuarioLogin, current_user: Usuario):
    if current_user.id != usuario_id and not current_user.admin:
        raise HTTPException(status_code=403, detail="Você não tem permissão para deletar este usuário.")
        
    if confirmacao.email != current_user.email or not verificar_senha(confirmacao.senha, current_user.senha):
        raise HTTPException(status_code=401, detail="Email ou senha de confirmação incorretos.")
        
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if usuario:
        db.delete(usuario)
        db.commit()
        return {"status": "Sucesso", "mensagem": "Usuário deletado!"}
    return {"status": "Erro", "mensagem": "Usuário não encontrado"}