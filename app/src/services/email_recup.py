from fastapi_mail import FastMail, MessageSchema, MessageType
from pydantic import EmailStr

from .email_config import CONF


async def enviar_email_recuperacao(email_destino: EmailStr, token_recuperacao: str):
    # Substitua a URL base abaixo pela URL real do seu Front-end (ex: React, Vue, App)
    link_reset = f"http://localhost:3000/nova-senha?email={email_destino}&codigo={token_recuperacao}"

    html = f"""
    <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
        <h3>Recuperação de Senha</h3>
        <p>Clique no botão abaixo para redefinir sua senha de forma segura:</p>
        <a href="{link_reset}" style="display: inline-block; padding: 10px 20px; color: white; background-color: #007bff; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 10px;">Redefinir Minha Senha</a>
        <p style="margin-top: 20px; font-size: 12px; color: #777;">Se você não solicitou isso, ignore este e-mail.</p>
    </div>
    """

    message = MessageSchema(
        subject="Recuperação de Senha da sua Conta",
        recipients=[email_destino],
        body=html,
        subtype=MessageType.html,
    )

    fm = FastMail(CONF)
    await fm.send_message(message)
    return {"message": "Email enviado com sucesso"}
