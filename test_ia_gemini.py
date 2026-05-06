"""
Script de teste para validar a integração da IA Gemini com o SAGE App.
Execute este script após configurar as variáveis de ambiente.

Requisitos:
- pip install requests python-dotenv
- GEMINI_API_KEY configurada no .env
- Servidor FastAPI rodando (python -m uvicorn app.main:app --reload)
"""

import requests
import json
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta

load_dotenv()

# Configuração
BASE_URL = "http://localhost:8000"
TEST_EMAIL = "teste_ia@example.com"
TEST_PASSWORD = "SenhaSegura123!"
TEST_USER_NAME = "Teste IA"

# Cores para output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
END = '\033[0m'

def print_success(message):
    print(f"{GREEN}✓ {message}{END}")

def print_error(message):
    print(f"{RED}✗ {message}{END}")

def print_info(message):
    print(f"{BLUE}ℹ {message}{END}")

def print_response(response):
    print(f"{YELLOW}Response:{END}")
    print(json.dumps(response.json(), indent=2, ensure_ascii=False))
    print()

class TesteIA:
    def __init__(self):
        self.token = None
        self.usuario_id = None
        
    def teste_1_cadastro_usuario(self):
        """Teste 1: Cadastrar novo usuário"""
        print(f"\n{BLUE}{'='*60}{END}")
        print(f"{BLUE}TESTE 1: Cadastrar Usuário (com dica de boas-vindas){END}")
        print(f"{BLUE}{'='*60}{END}")
        
        payload = {
            "nome": TEST_USER_NAME,
            "email": TEST_EMAIL,
            "senha": TEST_PASSWORD,
            "ativo": True
        }
        
        response = requests.post(f"{BASE_URL}/usuarios/", json=payload)
        
        if response.status_code == 200:
            data = response.json()
            print_response(response)
            
            if "dica_boas_vindas" in data:
                print_success("Dica de boas-vindas gerada!")
                print(f"{YELLOW}Dica:{END} {data['dica_boas_vindas'].get('dica', 'N/A')}")
                self.usuario_id = data['usuario']['id']
                return True
            else:
                print_error("Dica de boas-vindas não foi gerada")
                return False
        else:
            print_error(f"Erro no cadastro: {response.status_code}")
            print_response(response)
            return False
    
    def teste_2_login_com_dica(self):
        """Teste 2: Login e receber dica genérica"""
        print(f"\n{BLUE}{'='*60}{END}")
        print(f"{BLUE}TESTE 2: Login (com dica genérica){END}")
        print(f"{BLUE}{'='*60}{END}")
        
        payload = {
            "email": TEST_EMAIL,
            "senha": TEST_PASSWORD
        }
        
        response = requests.post(f"{BASE_URL}/usuarios/login", json=payload)
        
        if response.status_code == 200:
            data = response.json()
            print_response(response)
            
            if "dica_boas_vindas" in data and data["dica_boas_vindas"].get("status") == "Sucesso":
                print_success("Dica genérica recebida no login!")
                print(f"{YELLOW}Dica:{END} {data['dica_boas_vindas']['dica']}")
                self.token = data['token_acesso']
                self.usuario_id = data['usuario']['id']
                return True
            else:
                print_error("Dica no login não foi retornada")
                return False
        else:
            print_error(f"Erro no login: {response.status_code}")
            print_response(response)
            return False
    
    def teste_3_registrar_consumo(self):
        """Teste 3: Registrar consumo e receber feedback da IA"""
        print(f"\n{BLUE}{'='*60}{END}")
        print(f"{BLUE}TESTE 3: Registrar Consumo (com feedback IA){END}")
        print(f"{BLUE}{'='*60}{END}")
        
        if not self.token:
            print_error("Token não disponível. Faça login primeiro.")
            return False
        
        headers = {"Authorization": f"Bearer {self.token}"}
        payload = {
            "tipo_consumo": "agua",
            "quantidade": 150,
            "unidade": "litros",
            "preco": 37.50,
            "data": datetime.now().strftime("%Y-%m-%d"),
            "simulacao": False
        }
        
        response = requests.post(
            f"{BASE_URL}/consumo/",
            json=payload,
            headers=headers
        )
        
        if response.status_code == 200:
            data = response.json()
            print_response(response)
            
            if "feedback_ia" in data and data["feedback_ia"].get("status") == "Sucesso":
                print_success("Feedback IA gerado após registrar consumo!")
                print(f"{YELLOW}Feedback:{END} {data['feedback_ia']['feedback']}")
                print(f"{YELLOW}Comparação:{END}")
                print(f"  - Consumo registrado: {data['feedback_ia']['comparacao']['consumo_registrado']}")
                print(f"  - Média anterior: {data['feedback_ia']['comparacao']['media_anterior']}")
                print(f"  - Diferença: {data['feedback_ia']['comparacao']['diferenca']}")
                return True
            else:
                print_error("Feedback IA não foi gerado")
                return False
        else:
            print_error(f"Erro ao registrar consumo: {response.status_code}")
            print_response(response)
            return False
    
    def teste_4_dica_genérica(self):
        """Teste 4: Solicitar dica genérica"""
        print(f"\n{BLUE}{'='*60}{END}")
        print(f"{BLUE}TESTE 4: Solicitar Dica Genérica{END}")
        print(f"{BLUE}{'='*60}{END}")
        
        if not self.token:
            print_error("Token não disponível. Faça login primeiro.")
            return False
        
        headers = {"Authorization": f"Bearer {self.token}"}
        
        # Teste sem tipo específico
        response = requests.get(
            f"{BASE_URL}/dicas/ia/genérica",
            headers=headers
        )
        
        if response.status_code == 200:
            data = response.json()
            print_response(response)
            print_success("Dica genérica obtida!")
            print(f"{YELLOW}Dica:{END} {data['dica']}")
            return True
        else:
            print_error(f"Erro ao obter dica genérica: {response.status_code}")
            print_response(response)
            return False
    
    def teste_5_dica_personalizada(self):
        """Teste 5: Solicitar dica personalizada"""
        print(f"\n{BLUE}{'='*60}{END}")
        print(f"{BLUE}TESTE 5: Solicitar Dica Personalizada{END}")
        print(f"{BLUE}{'='*60}{END}")
        
        if not self.token:
            print_error("Token não disponível. Faça login primeiro.")
            return False
        
        headers = {"Authorization": f"Bearer {self.token}"}
        
        response = requests.get(
            f"{BASE_URL}/dicas/ia/personalizada",
            headers=headers
        )
        
        if response.status_code == 200:
            data = response.json()
            print_response(response)
            
            if data.get("status") == "Sucesso":
                print_success("Dica personalizada gerada!")
                print(f"{YELLOW}Dica:{END} {data['dica']}")
                if "analise" in data:
                    print(f"{YELLOW}Análise:{END}")
                    for chave, valor in data['analise'].items():
                        print(f"  - {chave}: {valor}")
                return True
            elif data.get("status") == "Info":
                print_info(data.get("mensagem", "Sem histórico suficiente"))
                return True
            else:
                print_error("Erro ao gerar dica personalizada")
                return False
        else:
            print_error(f"Erro ao obter dica personalizada: {response.status_code}")
            print_response(response)
            return False
    
    def teste_6_historico_dicas(self):
        """Teste 6: Listar histórico de dicas"""
        print(f"\n{BLUE}{'='*60}{END}")
        print(f"{BLUE}TESTE 6: Listar Histórico de Dicas{END}")
        print(f"{BLUE}{'='*60}{END}")
        
        if not self.token:
            print_error("Token não disponível. Faça login primeiro.")
            return False
        
        headers = {"Authorization": f"Bearer {self.token}"}
        
        response = requests.get(
            f"{BASE_URL}/dicas/ia/historico?limite=5",
            headers=headers
        )
        
        if response.status_code == 200:
            data = response.json()
            print_response(response)
            
            if data.get("total", 0) > 0:
                print_success(f"Histórico obtido! Total de dicas: {data['total']}")
                for i, dica in enumerate(data['dicas'], 1):
                    print(f"  {i}. {dica['titulo']}")
                return True
            else:
                print_info("Nenhuma dica no histórico ainda")
                return True
        else:
            print_error(f"Erro ao obter histórico: {response.status_code}")
            print_response(response)
            return False
    
    def executar_todos_testes(self):
        """Executa todos os testes em sequência"""
        print(f"\n{BLUE}{'='*70}{END}")
        print(f"{BLUE}INICIANDO TESTES DE INTEGRAÇÃO COM IA GEMINI - SAGE APP{END}")
        print(f"{BLUE}{'='*70}{END}")
        print(f"{YELLOW}Servidor: {BASE_URL}{END}")
        print(f"{YELLOW}Email de teste: {TEST_EMAIL}{END}")
        print()
        
        resultados = {
            "Cadastro com dica": self.teste_1_cadastro_usuario(),
            "Login com dica": self.teste_2_login_com_dica(),
            "Consumo com feedback": self.teste_3_registrar_consumo(),
            "Dica genérica": self.teste_4_dica_genérica(),
            "Dica personalizada": self.teste_5_dica_personalizada(),
            "Histórico de dicas": self.teste_6_historico_dicas(),
        }
        
        # Resumo
        print(f"\n{BLUE}{'='*70}{END}")
        print(f"{BLUE}RESUMO DOS TESTES{END}")
        print(f"{BLUE}{'='*70}{END}")
        
        total = len(resultados)
        sucesso = sum(1 for v in resultados.values() if v)
        
        for teste, resultado in resultados.items():
            status = f"{GREEN}✓ PASSOU{END}" if resultado else f"{RED}✗ FALHOU{END}"
            print(f"{status} - {teste}")
        
        print()
        print(f"Total: {sucesso}/{total} testes passaram")
        
        if sucesso == total:
            print(f"{GREEN}🎉 Todos os testes passaram! IA integrada com sucesso!{END}")
        else:
            print(f"{RED}⚠️  {total - sucesso} teste(s) falharam. Verifique os logs acima.{END}")


if __name__ == "__main__":
    print_info("Verificando variáveis de ambiente...")
    
    if not os.environ.get("GEMINI_API_KEY"):
        print_error("GEMINI_API_KEY não configurada no .env")
        print_info("Adicione sua chave em: https://aistudio.google.com/app/apikeys")
        exit(1)
    
    print_success("GEMINI_API_KEY configurada")
    print_info(f"Conectando a {BASE_URL}...")
    
    try:
        response = requests.get(f"{BASE_URL}/docs", timeout=2)
        print_success("Servidor respondendo")
    except requests.exceptions.ConnectionError:
        print_error(f"Não foi possível conectar a {BASE_URL}")
        print_info("Certifique-se de que o servidor está rodando:")
        print_info("  python -m uvicorn app.main:app --reload")
        exit(1)
    
    # Limpar usuário anterior se existir (opcional)
    print_info(f"Iniciando testes...")
    
    teste = TesteIA()
    teste.executar_todos_testes()
