from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from datetime import date
from typing import List, Optional
from security import gerar_senha, verificar_senha
from database import engine, SenssionLocal, Base
import random


app = FastAPI(
    title="SAGE - App Consumo Sustentável",
    description="API para monitoramento de energia, água e outros."
)



# --- MODELOS DE DADOS ---

class Usuario(BaseModel):
    id: Optional[int] = None
    nome: str
    email: str
    senha: str

class Consumo(BaseModel):
    id: Optional[int] = None
    tipo: str  
    quantidade: float
    unidade: str 
    preco: float 
    data: date
    simulado: bool = False # Padronizado para 'simulado'

class Meta(BaseModel):
    id: Optional[int] = None
    tipo: str 
    quantidade_alvo: float # Mudado de 'objetivo' para 'quantidade_alvo'
    prazo: date

# --- BANCO DE DADOS TEMPORÁRIO ---
db_usuarios = []
db_consumos = []
db_metas = []

# --- ROTAS ---

@app.get("/")
def home():
    return {"mensagem": "Servidor SAGE Online!"}

# Rota de cadastro de usuário
@app.post("/usuarios/", tags=["Usuários"])
def cadastrar_usuario(user: Usuario):
    # Gerar ID automático se não vier um
    if user.id is None or user.id == 0:
        user.id = len(db_usuarios) + 1

    user.senha = gerar_senha(user.senha)

    db_usuarios.append(user)
    return {"status": "Sucesso", "mensagem": f"Usuário {user.nome} cadastrado!"}

# Rota de recuperação de senha (simulada)
@app.post("/usuarios/rec-senha/",tags=["Usuários"])
def rec_senha(email:str):
    for user in db_usuarios:
        if user.email == email:
            return {"status": "Sucesso", "mensagem": f"Senha enviada para {email}!"}
    return {"status": "Erro", "mensagem": "Email não cadastrado!"}

# Rota de login social (simulada)
@app.post("/usuarios/login-social", tags=["Usuários"])
def login_social(provedor: str, token: str):
    if token:
        return{
            "status": "Sucesso",
            "mensagem": f"Login via {provedor} realizado com sucesso?",
            "token_acesso":"jwt_token_gerado_pela_api"
        }
    return {"status": "Erro", "mensagem": "Falha na autenticação social"}

#Rota de login tradicional (simulada)
@app.post("/usuarios/login",tags= ["Usuários"])
def login_tradicional(email: str, senha:str):
    for user in db_usuarios:
        if user.email == email and verificar_senha (senha, user.senha):
            return {
                "status": "Sucesso",
                "mensagem": f"Login tradicional para {email} realizado com sucesso!",
                "token_acesso":"jwt_token_gerado_pela_api"
            }
    return {"status": "Erro", "mensagem": "E-mail ou senha incorretos!"}

# Rora para buscar ps dados do perfil do usuario logado
@app.get("/usuarios/perfil/{user_id}", tags=["Usuários"])
def ver_perfil(usuario_id: int):
    for user in db_usuarios:
        if user.id == usuario_id:
            return{
                "nome": user.nome,
                "email": user.email,
                "status": "Ativo"
            }
    return{"Status": "Erro", "mensagem": "Usuário não encontrado"}
        
#rota para editar o usuário editar seu perfil
@app.put("/usuarios/perfil/{usuario_id}", tags=["Usuários"])
def editar_perfil(usuario_id: int, dadosN: Usuario):
    for index, user in enumerate(db_usuarios):
        if user.id == usuario_id:
            dadosN.id = usuario_id
            db_usuarios[index] = dadosN
            return {"status": "Sucesso", "mensagem": "Perfil atualizado!"}
    return {"status": "Erro", "mensagem": "Usuário não encontrado"}

# Rotas de Consumo
@app.post("/consumo/", tags=["Consumo"])
def registrar_consumo(item: Consumo):
    if item.id is None:
        item.id = len(db_consumos) + 1 
    db_consumos.append(item)
    return {"status": "Sucesso", "dados": item}

@app.put("/consumo/{consumo_id}", tags=["Consumo"])
def atualizar_consumo(consumo_id: int, item_atualizado: Consumo):
    for index, item in enumerate(db_consumos):
        if item.id == consumo_id:
            item_atualizado.id = consumo_id
            db_consumos[index] = item_atualizado
            return {"status": "Atualizado com sucesso", "dados": item_atualizado}
    return {"status": "Erro", "mensagem": "Registo não encontrado"}

@app.delete("/consumo/{consumo_id}", tags=["Consumo"])
def delete_consumo(consumo_id: int):
    for index, item in enumerate(db_consumos):
        if item.id == consumo_id:
            db_consumos.pop(index)
            return {"status": "Eliminado com sucesso"}
    return {"status": "Erro", "mensagem": "Registo não encontrado"}

@app.get("/consumo/", response_model=List[Consumo], tags=["Consumo"])
def listar_consumos(tipo: Optional[str] = None, mes: Optional[int] = None, ano: Optional[int] = None):
    resultado = db_consumos
    
    # Filtro por Tipo (Energia/Água)
    if tipo:
        resultado = [c for c in resultado if c.tipo.lower() == tipo.lower()]
        
    # Filtro por Mês (Baseado na data do registro)
    if mes:
        resultado = [c for c in resultado if c.data.month == mes]
        
    # Filtro por Ano
    if ano:
        resultado = [c for c in resultado if c.data.year == ano]
        
    return resultado

# Nosso catálogo inteligente de dicas separadas por categoria
CATALOGO_DICAS = {
    "energia": [
        "Desligue os aparelhos da tomada quando não estiverem em uso. O modo 'standby' também consome energia!",
        "Aproveite a luz natural abrindo janelas e cortinas durante o dia.",
        "Substitua lâmpadas antigas por modelos LED, que são mais eficientes e duram até 25 vezes mais.",
        "Junte o máximo de roupas possível antes de usar a máquina de lavar ou o ferro de passar."
    ],
    "agua": [
        "Feche a torneira ao escovar os dentes. Isso pode economizar até 12 litros de água por minuto!",
        "Verifique vazamentos em casa. Uma torneira pingando desperdiça mais de 40 litros de água por dia.",
        "Tome banhos mais curtos. Reduzir o banho em apenas 5 minutos economiza muita água e energia.",
        "Reaproveite a água da máquina de lavar para lavar o quintal ou o piso da casa."
    ]
}
# --- ROTAS DE DICAS ---

@app.get("/dicas/", tags=["Dicas"])
def dica_aleatoria_geral():
    """Retorna uma dica aleatória de qualquer categoria."""
    # Junta todas as listas em uma só grande caixa de dicas
    todas_as_dicas = CATALOGO_DICAS["energia"] + CATALOGO_DICAS["agua"]

    dica_sorteada = random.choice(todas_as_dicas)
    return {"status": "Sucesso", "dica_do_dia": dica_sorteada}

@app.get("/dicas/{categoria}", tags=["Dicas"])
def dica_por_categoria(categoria: str):
    """
    Retorna uma dica focada no problema do usuário. 
    Categorias aceitas: 'energia', 'agua' ou 'materiais'.
    """
    categoria_formatada = categoria.lower()
    
    if categoria_formatada in CATALOGO_DICAS:
        dica_sorteada = random.choice(CATALOGO_DICAS[categoria_formatada])
        return {"status": "Sucesso", "categoria": categoria_formatada, "dica": dica_sorteada}
        
    return {"status": "Erro", "mensagem": "Categoria inválida. Use: energia, agua ou materiais."}



@app.post("/metas/", tags=["Metas"])
def definir_meta(nova_meta: Meta):
    if nova_meta.id is None:
        nova_meta.id = len(db_metas) + 1
    db_metas.append(nova_meta)
    return {"status": "Meta definida com sucesso!", "dados": nova_meta}

@app.get("/metas/progresso/{tipo}", tags=["Metas"])
def calcular_progresso(tipo: str):
    meta_atual = None
    for m in db_metas:
        if m.tipo.lower() == tipo.lower():
            meta_atual = m
            break
            
    if meta_atual is None:
        return {"status": "Erro", "mensagem": f"Nenhuma meta definida para {tipo}."}

    total_consumido = 0.0
    total_pago = 0.0
    for c in db_consumos:
        # Aqui usamos 'simulado' que agora combina com o modelo lá no topo
        if c.tipo.lower() == tipo.lower() and c.simulado == False:
            total_consumido += c.quantidade
            total_pago += c.preco

    porcentagem = (total_consumido / meta_atual.quantidade_alvo) * 100

    custo_estimado_meta = 0.0
    if total_consumido > 0:
        preco_por_unidade = total_pago / total_consumido
        custo_estimado_meta = meta_atual.quantidade_alvo * preco_por_unidade

    return {
        "tipo": tipo,
        "progresso": {
            "quantidade_atual": total_consumido,
            "limite_meta": meta_atual.quantidade_alvo,
            "porcentagem": round(porcentagem, 1)
        },
        "financeiro": {
            "total_pago_ate_agora": round(total_pago, 2),
            "estimativa_custo_na_meta": round(custo_estimado_meta, 2)
        },
        "alerta": "Cuidado! Meta ultrapassada!" 
        if porcentagem > 100 else "Dentro do limite!"
    }