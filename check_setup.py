#!/usr/bin/env python3
"""
Verificador rápido de instalação - SAGE App + IA Gemini
Execute este script para validar se tudo foi instalado corretamente.
"""

import sys
import os
from pathlib import Path

def check_requirement(requirement, description):
    """Verifica se um requirement está disponível."""
    try:
        if requirement == "python":
            version = f"{sys.version_info.major}.{sys.version_info.minor}"
            print(f"✓ Python {version}")
            return True
        elif requirement == ".env":
            if Path(".env").exists():
                print(f"✓ Arquivo .env encontrado")
                return True
            elif Path(".env.example").exists():
                print(f"⚠ Arquivo .env NÃO encontrado. Use: copy .env.example .env")
                return False
            else:
                print(f"✗ Arquivo .env.example não encontrado")
                return False
        else:
            __import__(requirement)
            print(f"✓ {requirement}")
            return True
    except ImportError:
        print(f"✗ {requirement} - NÃO INSTALADO")
        print(f"  Instale com: pip install {requirement}")
        return False
    except Exception as e:
        print(f"✗ Erro ao verificar {requirement}: {e}")
        return False

def check_files():
    """Verifica se os arquivos principais foram criados."""
    files = {
        "app/ai/gemini_service.py": "Serviço Gemini",
        "app/src/services/dicas_service.py": "Serviço de Dicas",
        "app/src/schemas/dica_schema.py": "Schema de Dica",
        ".env.example": "Arquivo de configuração",
        "IA_GEMINI_DOCUMENTACAO.md": "Documentação IA",
        "SETUP_README.md": "Guia de Setup",
        "test_ia_gemini.py": "Script de testes",
    }
    
    print("\n📁 Verificando arquivos...")
    all_good = True
    for file_path, description in files.items():
        if Path(file_path).exists():
            print(f"  ✓ {file_path}")
        else:
            print(f"  ✗ {file_path} - NÃO ENCONTRADO")
            all_good = False
    
    return all_good

def check_env_vars():
    """Verifica se as variáveis de ambiente estão configuradas."""
    print("\n🔧 Verificando variáveis de ambiente...")
    from dotenv import load_dotenv
    
    load_dotenv()
    
    required_vars = {
        "GEMINI_API_KEY": "Chave da API Gemini",
        "DATABASE_URL": "URL do banco de dados (opcional)",
    }
    
    all_good = True
    for var, description in required_vars.items():
        value = os.environ.get(var)
        if value:
            masked = value[:10] + "..." if len(value) > 10 else value
            print(f"  ✓ {var} = {masked}")
        else:
            if var == "DATABASE_URL":
                print(f"  ⚠ {var} - NÃO CONFIGURADO (usando SQLite padrão)")
            else:
                print(f"  ✗ {var} - NÃO CONFIGURADO")
                all_good = False
    
    return all_good

def check_imports():
    """Verifica se os módulos principais podem ser importados."""
    print("\n🔌 Verificando imports dos módulos...")
    
    imports = {
        "fastapi": "FastAPI",
        "sqlalchemy": "SQLAlchemy",
        "pydantic": "Pydantic",
        "google.generativeai": "Google Generative AI",
        "dotenv": "Python Dotenv",
    }
    
    all_good = True
    for module, name in imports.items():
        try:
            __import__(module)
            print(f"  ✓ {name}")
        except ImportError:
            print(f"  ✗ {name} - NÃO INSTALADO")
            all_good = False
    
    return all_good

def main():
    print("=" * 60)
    print("🌱 VERIFICADOR DE INSTALAÇÃO - SAGE APP + IA GEMINI")
    print("=" * 60)
    
    print("\n📦 Dependências do Python...")
    check_requirement("python", "Python")
    
    req_check = check_imports()
    files_check = check_files()
    env_check = check_env_vars()
    
    print("\n" + "=" * 60)
    print("📊 RESUMO")
    print("=" * 60)
    
    all_checks = [req_check, files_check, env_check]
    
    if all(all_checks):
        print("✅ Tudo configurado! Você pode iniciar o servidor com:")
        print("   python -m uvicorn app.main:app --reload")
        print("\nDepois execute o teste:")
        print("   python test_ia_gemini.py")
        return 0
    else:
        print("❌ Há problemas de configuração. Corrija os itens acima.")
        print("\nVerifique o arquivo SETUP_README.md para instruções detalhadas.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
