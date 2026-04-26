import os
from fastapi_mail import ConnectionConfig
from dotenv import load_dotenv

# Carrega as variáveis do .env
load_dotenv()
CONF = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME", "seu_email@gmail.com"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD", "sua_senha_de_app_do_gmail"),
    MAIL_FROM=os.getenv("MAIL_FROM", "seu_email@gmail.com"),
    MAIL_PORT=int(os.getenv("MAIL_PORT", 465)),
    MAIL_SERVER=os.getenv("MAIL_SERVER", "smtp.gmail.com"),
    MAIL_STARTTLS=os.getenv("MAIL_STARTTLS", "False").lower() in {"true", "1", "yes"},
    MAIL_SSL_TLS=os.getenv("MAIL_SSL_TLS", "True").lower() in {"true", "1", "yes"},
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
)
