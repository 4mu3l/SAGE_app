# 🌱 SAGE App - Aplicação com IA Gemini Integrada

> Sistema de monitoramento de consumo sustentável com **dicas personalizadas geradas por Inteligência Artificial**

## 🎯 O que é o SAGE App?

SAGE é uma aplicação para monitoramento de consumo de energia, água e outros recursos com foco em **sustentabilidade**. Agora, com **IA Gemini integrada**, ela oferece:

- 💡 **Dicas Personalizadas** - A IA analisa seu histórico e oferece recomendações específicas
- 📊 **Feedback Imediato** - Ao registrar novo consumo, recebe análise comparativa
- 🎯 **Engajamento** - Dicas ao fazer login para motivar ações sustentáveis
- 📈 **Histórico** - Todas as dicas são salvas para consulta posterior

## ✨ Novas Funcionalidades com IA

### 1. **Dica ao Fazer Cadastro**
Quando você se registra, recebe uma dica de boas-vindas para começar bem!

### 2. **Dica ao Fazer Login** 
A cada entrada, uma nova dica genérica para inspiração

### 3. **Feedback ao Registrar Consumo**
Registra 180L de água? A IA compara com seu histórico e diz:
> "Isso é 20% MAIS que sua média (150L). Sugerimos instalar aeradores em torneiras para economizar até 30%!"

### 4. **Dica Personalizada**
Solicita análise completa do seu consumo do mês:
> "Você consumiu principalmente água (1200L) nos últimos 30 dias. Seus horários pico são às 10h e 18h. Recomendamos programas eco na máquina de lavar após 22h para economizar 30%."

### 5. **Histórico de Dicas**
Acesse todas as dicas já recebidas

## 🚀 Quick Start (5 minutos)

### 1. Preparar Ambiente
```bash
cd e:\SAGE_app
pip install -r requirements.txt
pip install google-generativeai
```

### 2. Obter Chave da API
1. Acesse: https://aistudio.google.com/app/apikeys
2. Copie a chave gerada

### 3. Configurar
```bash
# Copiar arquivo de exemplo
copy .env.example .env

# Editar .env e adicionar:
GEMINI_API_KEY=sua_chave_aqui
```

### 4. Executar
```bash
python -m uvicorn app.main:app --reload
```

### 5. Testar
```bash
python test_ia_gemini.py
```

## 📚 Documentação

| Arquivo | Descrição |
|---------|-----------|
| [**QUICK_START.md**](QUICK_START.md) | ⚡ Início rápido em 5 minutos |
| [**SETUP_README.md**](SETUP_README.md) | 🔧 Guia completo de configuração |
| [**IA_GEMINI_DOCUMENTACAO.md**](IA_GEMINI_DOCUMENTACAO.md) | 📚 Documentação técnica detalhada |
| [**IMPLEMENTACAO_RESUMO.md**](IMPLEMENTACAO_RESUMO.md) | 📋 Resumo visual da implementação |
| [**INVENTARIO_COMPLETO.md**](INVENTARIO_COMPLETO.md) | 📦 Tudo que foi criado/modificado |

## 🔧 Configuração Rápida

### Variáveis de Ambiente
```env
# Essencial (NOVO!)
GEMINI_API_KEY=sua_chave_aqui

# Banco de Dados
DATABASE_URL=sqlite:///./sage.db

# Segurança
SECRET_KEY=sua_chave_secreta_aqui
ALGORITHM=HS256

# Email (opcional)
MAIL_USERNAME=seu_email@gmail.com
MAIL_PASSWORD=senha_app
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
```

## 📊 API Endpoints Principais

### Autenticação (Sem Proteção)
```
POST /usuarios/              - Cadastro com dica boas-vindas
POST /usuarios/login         - Login com dica genérica
```

### Dicas com IA (Protegido)
```
GET  /dicas/ia/genérica      - Dica genérica (opcional: tipo_consumo)
GET  /dicas/ia/personalizada - Dica baseada em histórico
GET  /dicas/ia/historico     - Listar dicas anteriores
```

### Consumo (Protegido)
```
POST /consumo/               - Registrar + receber feedback da IA
GET  /consumo/               - Listar consumos
```

## 💡 Exemplos de Uso

### Login
```bash
curl -X POST "http://localhost:8000/usuarios/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "senha": "senha123"
  }'
```

Resposta inclui:
```json
{
  "token_acesso": "eyJ0eXAiOiJKV1Q...",
  "usuario": { "id": 1, "nome": "João", "email": "..." },
  "dica_boas_vindas": {
    "titulo": "⚡ Dica de Economia de Energia",
    "dica": "Desligue os aparelhos..."
  }
}
```

### Registrar Consumo com Feedback
```bash
curl -X POST "http://localhost:8000/consumo/" \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "tipo_consumo": "agua",
    "quantidade": 180,
    "unidade": "litros",
    "preco": 45.50,
    "data": "2024-05-05"
  }'
```

Resposta inclui:
```json
{
  "consumo": { "id": 1, "tipo_consumo": "agua", ... },
  "feedback_ia": {
    "feedback": "Você registrou 180L...",
    "comparacao": {
      "media_anterior": 150,
      "diferenca": 30,
      "percentual_diferenca": "20.0%"
    }
  }
}
```

## 🧪 Teste Automatizado

```bash
python test_ia_gemini.py
```

Testa:
- ✓ Cadastro com dica
- ✓ Login com dica
- ✓ Consumo com feedback
- ✓ Dica genérica
- ✓ Dica personalizada
- ✓ Histórico

## ✅ Checklist pré-Deploy

- [ ] Clonar/preparar repositório
- [ ] Criar arquivo `.env` com `GEMINI_API_KEY`
- [ ] Executar `pip install -r requirements.txt`
- [ ] Executar `python test_ia_gemini.py` com sucesso
- [ ] Testar endpoints manualmente
- [ ] Configurar banco de dados em produção
- [ ] Configurar variáveis de ambiente no servidor
- [ ] Deploy!

## 📱 Integração com Frontend

### Ao fazer login
```javascript
const response = await fetch('/usuarios/login', {...});
const data = await response.json();
showNotification(data.dica_boas_vindas.dica); // Exibir dica
```

### Ao registrar consumo
```javascript
const response = await fetch('/consumo/', {...});
const data = await response.json();
showFeedback(data.feedback_ia.feedback); // Exibir feedback
```

### Solicitar dica personalizada
```javascript
const response = await fetch('/dicas/ia/personalizada', {...});
const data = await response.json();
displayTips(data); // Exibir análise completa
```

## 🐛 Problemas Comuns

### "GEMINI_API_KEY não configurada"
```bash
# Adicione ao .env
GEMINI_API_KEY=sua_chave_aqui

# Ou defina como variável de ambiente
# Windows: $env:GEMINI_API_KEY="chave"
# Linux: export GEMINI_API_KEY="chave"
```

### "ModuleNotFoundError: No module named 'google'"
```bash
pip install google-generativeai
```

### Porta 8000 em uso
```bash
python -m uvicorn app.main:app --reload --port 8001
```

## 📂 Estrutura do Projeto

```
SAGE_app/
├── app/
│   ├── ai/
│   │   └── gemini_service.py        ← IA Gemini
│   ├── src/
│   │   ├── services/
│   │   │   ├── dicas_service.py     ← Serviço de dicas
│   │   │   └── usuario_service.py   ← Com IA integrada
│   │   ├── routes/
│   │   │   ├── dicas_route.py       ← Endpoints IA
│   │   │   ├── consumo_route.py     ← Com feedback IA
│   │   │   └── usuario_route.py
│   │   └── models/
│   │       └── dica_model.py
│   └── main.py
├── .env                             ← Configurar com sua chave
├── test_ia_gemini.py               ← Teste automatizado
└── check_setup.py                  ← Verificar setup
```

## 🎓 Tecnologias Utilizadas

- **FastAPI** - Framework REST
- **SQLAlchemy** - ORM
- **Pydantic** - Validação
- **Google Generative AI** - Inteligência Artificial
- **JWT** - Autenticação
- **Python-dotenv** - Variáveis de ambiente

## 🚀 Deploy em Produção

### Variáveis Essenciais
```env
GEMINI_API_KEY=xxxxx
DATABASE_URL=postgresql://...
SECRET_KEY=xxxxx
DEBUG=False
```

### Comando
```bash
gunicorn app.main:app
```

### Plataformas Recomendadas
- Render.com
- Railway.app
- Heroku
- DigitalOcean

## 📈 Roadmap

- [ ] Cache com Redis
- [ ] Notificações em tempo real
- [ ] Relatórios mensais
- [ ] Sistema de gamificação
- [ ] Comparação com outros usuários
- [ ] Previsões com ML
- [ ] Integração com APIs de clima
- [ ] Mobile app
- [ ] Dashboard avançado

## 📞 Suporte

1. **Dúvidas sobre setup?** → Veja [SETUP_README.md](SETUP_README.md)
2. **Quick start?** → Veja [QUICK_START.md](QUICK_START.md)
3. **Detalhes técnicos?** → Veja [IA_GEMINI_DOCUMENTACAO.md](IA_GEMINI_DOCUMENTACAO.md)
4. **O que foi implementado?** → Veja [INVENTARIO_COMPLETO.md](INVENTARIO_COMPLETO.md)
5. **Testar tudo?** → Execute `python test_ia_gemini.py`

## 📜 Licença

Este projeto foi desenvolvido com IA integrada para fins educacionais e comerciais.

## 🙏 Créditos

- **Desenvolvido com:** Python + FastAPI + Google Gemini
- **Assistência:** GitHub Copilot
- **Data:** 05/05/2024

---

## ⚡ Comece Agora!

```bash
# 1. Clone/prepare
cd e:\SAGE_app

# 2. Instale
pip install -r requirements.txt
pip install google-generativeai

# 3. Configure
copy .env.example .env
# Edite .env com sua GEMINI_API_KEY

# 4. Execute
python -m uvicorn app.main:app --reload

# 5. Teste
python test_ia_gemini.py
```

**🎉 Seu SAGE App com IA está pronto para usar!**

---

**Próximo passo?** Leia [QUICK_START.md](QUICK_START.md) para começar em 5 minutos!
