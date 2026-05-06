# ⚡ Quick Start - SAGE App + IA Gemini

## 🚀 5 Minutos para Começar

### Passo 1: Clonar/Preparar (1 min)
```bash
cd e:\SAGE_app
```

### Passo 2: Instalar Dependências (2 min)
```bash
pip install -r requirements.txt
pip install google-generativeai
```

### Passo 3: Configurar API Key (1 min)
```bash
# 1. Acesse: https://aistudio.google.com/app/apikeys
# 2. Copie sua chave
# 3. Edite .env ou crie um:

# Windows PowerShell:
$env:GEMINI_API_KEY="sua_chave_aqui"

# Linux/Mac:
export GEMINI_API_KEY="sua_chave_aqui"
```

### Passo 4: Iniciar Servidor (1 min)
```bash
python -m uvicorn app.main:app --reload
```

### Passo 5: Testar 🎉
```bash
# Em outro terminal:
python test_ia_gemini.py
```

---

## 📌 Endpoints Principais

### 🔐 Login com Dica
```bash
curl -X POST "http://localhost:8000/usuarios/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"seu@email.com","senha":"sua_senha"}'
```

### 💡 Dica Genérica
```bash
curl -X GET "http://localhost:8000/dicas/ia/genérica" \
  -H "Authorization: Bearer SEU_TOKEN"
```

### 📊 Dica Personalizada
```bash
curl -X GET "http://localhost:8000/dicas/ia/personalizada" \
  -H "Authorization: Bearer SEU_TOKEN"
```

### 📝 Registrar Consumo + Feedback
```bash
curl -X POST "http://localhost:8000/consumo/" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tipo_consumo":"agua",
    "quantidade":150,
    "unidade":"litros",
    "preco":37.50,
    "data":"2024-05-05"
  }'
```

---

## 🧪 Teste Automático
```bash
python test_ia_gemini.py
```

Vai testar:
- ✓ Cadastro com dica
- ✓ Login com dica
- ✓ Registrar consumo
- ✓ Solicitar dicas
- ✓ Histórico

---

## 📖 Documentação Completa

- 📚 **IA_GEMINI_DOCUMENTACAO.md** - Funcionalidades detalhadas
- 🔧 **SETUP_README.md** - Guia de configuração
- 📋 **IMPLEMENTACAO_RESUMO.md** - Visão geral da implementação

---

## 🐛 Troubleshooting Rápido

| Problema | Solução |
|----------|---------|
| ModuleNotFoundError | `pip install google-generativeai` |
| GEMINI_API_KEY não encontrada | Configure em `.env` |
| Porta 8000 em uso | `python -m uvicorn app.main:app --reload --port 8001` |
| Erro de banco de dados | `alembic upgrade head` |

---

## ✅ Pronto!

Sua IA está rodando! 🎉

Próximos passos:
1. Integrar no frontend
2. Customizar prompts da IA
3. Adicionar mais tipos de consumo
4. Implementar notificações

---

**Tem dúvidas? Veja `SETUP_README.md` para mais detalhes.**
