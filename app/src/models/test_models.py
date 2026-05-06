import os
from dotenv import load_dotenv
from google import genai

load_dotenv()
api_key = os.environ.get("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

print("--- Teste de Conexão e Modelos ---")

# 1. Tentar listar TUDO o que a chave alcança (sem filtros)
print("\n1. Tentando listar modelos sem filtro:")
try:
    modelos = list(client.models.list())
    if not modelos:
        print("A lista retornou vazia novamente.")
    for m in modelos:
        print(f"- {m.name}")
except Exception as e:
    print(f"Erro ao listar: {e}")

# 2. Teste de 'Ping' nos modelos prováveis
print("\n2. Testando disponibilidade direta (Ping):")
candidatos = [
    "gemini-2.0-flash", 
    "gemini-2.0-flash-lite", 
    "gemini-1.5-flash",
    "models/gemini-1.5-flash"
]

for nome in candidatos:
    try:
        # Tenta apenas uma geração mínima para ver se o modelo responde
        response = client.models.generate_content(model=nome, contents="oi")
        print(f"✅ {nome}: DISPONÍVEL")
    except Exception as e:
        # Vamos pegar apenas o código do erro para não poluir o terminal
        msg = str(e)
        if "404" in msg:
            status = "404 (Não encontrado)"
        elif "429" in msg:
            status = "429 (Cota esgotada)"
        else:
            status = "Erro desconhecido"
        print(f"❌ {nome}: {status}")