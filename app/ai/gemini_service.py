import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
from google import genai
from google.genai import types
from sqlalchemy.orm import Session
from tenacity import retry, stop_after_attempt, wait_random_exponential

from app.src.models.consumo_model import Consumos
from app.src.models.dica_model import Dica
from app.src.models.usuario_model import Usuario

# 1. Carregar variáveis de ambiente primeiro
load_dotenv()

# 2. Configurações Globais da IA
# Vamos usar a versão 2.5 Flash Lite, que apareceu na sua lista
NOME_MODELO = "models/gemini-2.5-flash-lite"
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY") # Centralizado para evitar erro 404

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY não configurada no arquivo .env")

client = genai.Client(api_key=GEMINI_API_KEY)

# 3. Personalidade Padrão da IA
config_ia = types.GenerateContentConfig(
    system_instruction="Você é um assistente especializado em sustentabilidade e economia de recursos. Seja direto, prático e encorajador.",
    temperature=0.7
)

# 4. Função Auxiliar com Retry (Proteção contra Erro 429)
# Adicione o reraise=True no final dos parâmetros
@retry(wait=wait_random_exponential(min=1, max=10), stop=stop_after_attempt(3), reraise=True)
def chamar_ia_com_retry(prompt: str):
    return client.models.generate_content(
        model=NOME_MODELO,
        contents=prompt,
        config=config_ia
    )
# ==========================================
# FUNÇÕES DE BANCO DE DADOS E FORMATAÇÃO
# ==========================================

def obter_historico_consumos(db: Session, usuario_id: int, dias: int = 30):
    data_limite = datetime.now() - timedelta(days=dias)
    return db.query(Consumos).filter(
        Consumos.usuario_id == usuario_id,
        Consumos.data >= data_limite.date(),
        Consumos.simulacao == False
    ).order_by(Consumos.data.desc()).all()

def formatar_consumos_para_ia(consumos: list) -> str:
    if not consumos:
        return "Sem histórico de consumo registrado."
    
    consumo_formatado = "Histórico de Consumo:\n"
    for consumo in consumos:
        consumo_formatado += f"- {consumo.data}: {consumo.tipo_consumo} - {consumo.quantidade} {consumo.unidade} (R$ {consumo.preco})\n"
    return consumo_formatado

def obter_ultimas_dicas(db: Session, usuario_id: int, limite: int = 5) -> list:
    dicas = db.query(Dica).filter(
        Dica.usuario_id == usuario_id
    ).order_by(Dica.data_criacao.desc()).limit(limite).all()
    
    return [
        {
            "id": dica.id,
            "titulo": dica.titulo,
            "dica": dica.descricao,
            "tipo": dica.tipo_consumo,
            "data": dica.data_criacao
        }
        for dica in dicas
    ]

# ==========================================
# SERVIÇOS DE GERAÇÃO DE DICAS (IA)
# ==========================================

def gerar_dica_genérica(db: Session, usuario_id: int, tipo_consumo: str = None) -> dict:
    try:
        usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
        if not usuario:
            return {"status": "Erro", "mensagem": "Usuário não encontrado"}
        
        se_tipo = f"para {tipo_consumo}" if tipo_consumo else "para qualquer tipo de consumo"
        
        prompt = f"""
Crie UMA ÚNICA dica prática e acionável {se_tipo} para ajudar {usuario.nome} a reduzir consumo.
A dica deve:
1. Ser clara e específica
2. Ser fácil de implementar no dia a dia
3. Indicar o impacto ambiental ou financeiro
4. Ter no máximo 2-3 linhas

Responda APENAS com a dica.
"""
        # Usando a função com proteção de Retry!
        response = chamar_ia_com_retry(prompt)

        if not response or not response.text:
            raise Exception("Resposta vazia da IA")

        dica_texto = response.text.strip()
        
        if tipo_consumo and tipo_consumo.lower() == "agua":
            titulo = "Dica de Economia de Água"
        elif tipo_consumo and tipo_consumo.lower() == "energia":
            titulo = "Dica de Economia de Energia"
        else:
            titulo = "Dica Sustentável"
        
        nova_dica = Dica(
            titulo=titulo,
            descricao=dica_texto,
            tipo_consumo=tipo_consumo or "geral",
            usuario_id=usuario_id
        )
        db.add(nova_dica)
        db.commit()
        db.refresh(nova_dica)
        
        return {
            "status": "Sucesso",
            "dica_id": nova_dica.id,
            "titulo": nova_dica.titulo,
            "dica": dica_texto,
            "tipo": nova_dica.tipo_consumo,
            "data": nova_dica.data_criacao
        }
    
    except Exception as e:
        return {"status": "Erro", "mensagem": f"Erro ao gerar dica: {str(e)}"}


def gerar_dica_personalizada(db: Session, usuario_id: int) -> dict:
    try:
        usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
        if not usuario:
            return {"status": "Erro", "mensagem": "Usuário não encontrado"}
        
        consumos = obter_historico_consumos(db, usuario_id, dias=30)
        consumo_formatado = formatar_consumos_para_ia(consumos)
        
        if consumos:
            consumo_total = sum(c.quantidade for c in consumos)
            gasto_total = sum(c.preco for c in consumos)
            tipos = list(set(c.tipo_consumo for c in consumos))
            media_diaria = consumo_total / 30
        else:
            return {
                "status": "Info",
                "mensagem": "Sem histórico de consumo. Registre consumos para receber dicas personalizadas."
            }
        
        prompt = f"""
Usuário: {usuario.nome}
{consumo_formatado}
Resumo: Consumo total: {consumo_total} unidades | Gasto total: R$ {gasto_total:.2f} | Tipos: {', '.join(tipos)}

ANALISE os dados e crie UMA dica SUPER PERSONALIZADA para {usuario.nome}.
A dica deve:
1. Referenciar os dados do usuário
2. Identificar um padrão ou área de melhoria
3. Ter no máximo 3-4 linhas
Responda APENAS com a dica.
"""
        # Usando a função com proteção de Retry!
        response = chamar_ia_com_retry(prompt)

        if not response or not response.text:
            raise Exception("Resposta vazia da IA")

        dica_texto = response.text.strip()
        
        consumo_por_tipo = {}
        for consumo in consumos:
            consumo_por_tipo[consumo.tipo_consumo] = consumo_por_tipo.get(consumo.tipo_consumo, 0) + consumo.quantidade
        
        tipo_principal = max(consumo_por_tipo, key=consumo_por_tipo.get) if consumo_por_tipo else "geral"
        
        nova_dica = Dica(
            titulo=f"Dica Personalizada - {tipo_principal.capitalize()}",
            descricao=dica_texto,
            tipo_consumo=tipo_principal,
            usuario_id=usuario_id
        )
        db.add(nova_dica)
        db.commit()
        db.refresh(nova_dica)
        
        return {
            "status": "Sucesso",
            "dica_id": nova_dica.id,
            "titulo": nova_dica.titulo,
            "dica": dica_texto,
            "tipo": nova_dica.tipo_consumo,
            "data": nova_dica.data_criacao,
            "analise": {
                "consumo_total": consumo_total,
                "gasto_total": f"R$ {gasto_total:.2f}",
                "media_diaria": media_diaria,
                "tipos_consumo": tipos
            }
        }
    
    except Exception as e:
        return {"status": "Erro", "mensagem": f"Erro ao gerar dica personalizada: {str(e)}"}


def gerar_dica_apos_novo_consumo(db: Session, usuario_id: int, novo_consumo) -> dict:
    try:
        usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
        if not usuario:
            return {"status": "Erro", "mensagem": "Usuário não encontrado"}
        
        consumos_mesmo_tipo = db.query(Consumos).filter(
            Consumos.usuario_id == usuario_id,
            Consumos.tipo_consumo == novo_consumo.tipo_consumo,
            Consumos.id != novo_consumo.id,
            Consumos.simulacao == False
        ).order_by(Consumos.data.desc()).limit(5).all()
        
        if consumos_mesmo_tipo:
            media_anterior = sum(c.quantidade for c in consumos_mesmo_tipo) / len(consumos_mesmo_tipo)
            diferenca = novo_consumo.quantidade - media_anterior
            percentual = (diferenca / media_anterior * 100) if media_anterior > 0 else 0
        else:
            media_anterior = 0
            diferenca = 0
            percentual = 0
        
        comparacao = f"Você registrou {novo_consumo.quantidade} {novo_consumo.unidade} de {novo_consumo.tipo_consumo}."
        if media_anterior > 0:
            if diferenca > 0:
                comparacao += f"\nIsso é {abs(percentual):.1f}% MAIS que sua média anterior ({media_anterior:.2f})."
            else:
                comparacao += f"\nIsso é {abs(percentual):.1f}% MENOS que sua média anterior ({media_anterior:.2f})."
        
        prompt = f"""
{comparacao}
Analise se é bom ou preocupante e dê UMA dica ESPECÍFICA e IMEDIATA.
Responda em NO MÁXIMO 2-3 linhas.
Responda APENAS com o feedback/dica.
"""
        # Usando a função com proteção de Retry!
        response = chamar_ia_com_retry(prompt)

        if not response or not response.text:
            raise Exception("Resposta vazia da IA")

        dica_texto = response.text.strip()
        
        nova_dica = Dica(
            titulo=f"Feedback: {novo_consumo.tipo_consumo.capitalize()}",
            descricao=dica_texto,
            tipo_consumo=novo_consumo.tipo_consumo,
            usuario_id=usuario_id
        )
        db.add(nova_dica)
        db.commit()
        db.refresh(nova_dica)
        
        return {
            "status": "Sucesso",
            "feedback": dica_texto,
            "comparacao": {
                "consumo_registrado": novo_consumo.quantidade,
                "media_anterior": round(media_anterior, 2),
                "diferenca": round(diferenca, 2),
                "percentual_diferenca": f"{percentual:.1f}%"
            }
        }
    
    except Exception as e:
        return {"status": "Erro", "mensagem": f"Erro ao gerar feedback: {str(e)}"}