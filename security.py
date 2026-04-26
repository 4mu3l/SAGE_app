from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
moedor = PasswordHasher()

def gerar_senha(senha: str):
    """Gera um hash super seguro usando Argon2."""
    # O Argon2 já cuida da conversão para texto/bytes sozinho!
    return moedor.hash(senha)

def verificar_senha(senha_pura: str, senha_hash: str):
    """Compara a senha digitada com o hash Argon2 do banco de dados."""
    try:
        # Tenta verificar. Se bater, retorna True
        return moedor.verify(senha_hash, senha_pura)
    except VerifyMismatchError:
        # Se a senha estiver errada, ele cai aqui e retorna False
        return False