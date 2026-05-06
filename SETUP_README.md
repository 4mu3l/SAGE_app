# 🚀 Guia de Setup - SAGE App com IA Gemini

## 📋 Pré-requisitos

- Python 3.9+
- pip
- Acesso à internet
- Chave da API Google Gemini (gratuita)

## 🔑 Passo 1: Obter Chave da API Gemini

1. Acesse: https://aistudio.google.com/app/apikeys
2. Clique em **"Create API Key"**
3. Selecione ou crie um projeto Google Cloud
4. Copie a chave gerada

## 📦 Passo 2: Instalar Dependências

```bash
# Navegar até o diretório do projeto
cd e:\SAGE_app

# Criar virtual environment (se não existir)
python -m venv venv

# Ativar virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar/atualizar dependências
pip install -r requirements.txt

# Instalar pacotes da IA (se não estiverem em requirements.txt)
pip install google-generativeai
```

## 🔧 Passo 3: Configurar Variáveis de Ambiente

### Opção 1: Usar arquivo `.env` (Recomendado)

1. Copie o arquivo `.env.example` para `.env`:
```bash
copy .env.example .env
# ou
cp .env.example .env
```

2. Edite o arquivo `.env` e adicione suas credenciais:
```
GEMINI_API_KEY=sua_chave_api_aqui
DATABASE_URL=sqlite:///./sage.db
SECRET_KEY=sua_chave_secreta_aqui_mude_em_producao
MAIL_USERNAME=seu_email@gmail.com
MAIL_PASSWORD=sua_senha_de_app
```

### Opção 2: Variáveis de Ambiente do Sistema

**Windows (PowerShell):**
```powershell
$env:GEMINI_API_KEY="sua_chave_aqui"
$env:DATABASE_URL="sqlite:///./sage.db"
```

**Linux/Mac:**
```bash
export GEMINI_API_KEY="sua_chave_aqui"
export DATABASE_URL="sqlite:///./sage.db"
```

## 🗄️ Passo 4: Configurar Banco de Dados

O banco de dados será criado automaticamente ao iniciar o servidor:

```bash
# Se quiser executar migrações (Alembic)
alembic upgrade head
```

## 🚀 Passo 5: Iniciar o Servidor

```bash
# Modo desenvolvimento com reload automático
python -m uvicorn app.main:app --reload

# Modo produção (sem reload)
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

O servidor estará disponível em: **http://localhost:8000**

Documentação Swagger: **http://localhost:8000/docs**

## ✅ Passo 6: Validar a Integração

```bash
# Executar script de teste
python test_ia_gemini.py
```

Este script irá testar:
- ✓ Cadastro de usuário com dica
- ✓ Login com dica genérica
- ✓ Registro de consumo com feedback
- ✓ Solicitar dica genérica
- ✓ Solicitar dica personalizada
- ✓ Histórico de dicas

## 📝 Estrutura de Pastas Criada

```
SAGE_app/
├── app/
│   ├── ai/                          # ← Novo: Módulo de IA
│   │   ├── __init__.py
│   │   └── gemini_service.py        # ← Novo: Serviço Gemini
│   ├── src/
│   │   ├── services/
│   │   │   ├── usuario_service.py   # ← Atualizado
│   │   │   ├── consumo_service.py   # ← Atualizado
│   │   │   └── dicas_service.py     # ← Novo
│   │   ├── routes/
│   │   │   ├── usuario_route.py     # ← Atualizado (dica no login)
│   │   │   ├── consumo_route.py     # ← Atualizado (feedback)
│   │   │   └── dicas_route.py       # ← Atualizado (novos endpoints)
│   │   ├── schemas/
│   │   │   └── dica_schema.py       # ← Novo
│   │   └── models/
│   │       └── dica_model.py        # ← Já existia
│   ├── database.py
│   └── main.py
├── .env                             # ← Novo: Variáveis de ambiente
├── .env.example                     # ← Novo: Exemplo
├── IA_GEMINI_DOCUMENTACAO.md        # ← Novo: Documentação completa
├── SETUP_README.md                  # ← Este arquivo
├── test_ia_gemini.py                # ← Novo: Script de testes
└── requirements.txt
```

## 🔍 Verificar se Tudo Está Funcionando

1. **Acessar Swagger UI:**
   - Abra: http://localhost:8000/docs
   - Procure pelos novos endpoints em "Dicas IA"

2. **Testar um endpoint manualmente:**

```bash
# Terminal - Fazer login para obter token
curl -X POST "http://localhost:8000/usuarios/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"seu_email@example.com","senha":"sua_senha"}'

# Usar o token retornado para testar dica genérica
curl -X GET "http://localhost:8000/dicas/ia/genérica" \
  -H "Authorization: Bearer seu_token_aqui"
```

## 🐛 Troubleshooting

### Erro: "ModuleNotFoundError: No module named 'google'"
```bash
pip install google-generativeai python-dotenv
```

### Erro: "GEMINI_API_KEY não configurada"
- Verifique se o arquivo `.env` existe
- Verifique se a chave está corretamente preenchida
- Reinicie o servidor após adicionar o `.env`

### Erro: "Chave da API inválida"
- Gere uma nova chave em: https://aistudio.google.com/app/apikeys
- Atualize no arquivo `.env`

### Erro: "Conexão recusada" ao conectar ao BD
- Verifique se o caminho do sqlite está correto
- Ou configure um PostgreSQL/MySQL se estiver em produção

### Dica não é gerada
- Verifique se GEMINI_API_KEY está válida
- Verifique seu quota de requisições da API Gemini
- Procure por logs de erro no terminal

## 📊 Endpoints Principais com IA

| Método | Endpoint | Autenticação | Descrição |
|--------|----------|--------------|-----------|
| POST | `/usuarios/` | Não | Cadastro com dica boas-vindas |
| POST | `/usuarios/login` | Não | Login com dica genérica |
| GET | `/dicas/ia/genérica` | Sim | Dica genérica |
| GET | `/dicas/ia/personalizada` | Sim | Dica baseada em histórico |
| GET | `/dicas/ia/historico` | Sim | Listar dicas anteriores |
| POST | `/consumo/` | Sim | Registrar + receber feedback |

## 🔐 Segurança

- ✅ Toda requisição requer autenticação JWT (exceto login/cadastro)
- ✅ Dicas são isoladas por usuário
- ✅ Chave API em variável de ambiente (nunca em código)
- ✅ Dados sensíveis nunca são expostos em logs

## 📱 Sugestões de Uso no Frontend

```javascript
// Ao fazer login
const response = await fetch('/usuarios/login', {
  method: 'POST',
  body: JSON.stringify({email, senha})
});
const data = await response.json();
// Exibir: data.dica_boas_vindas.dica

// Ao registrar consumo
const response = await fetch('/consumo/', {
  method: 'POST',
  headers: {'Authorization': `Bearer ${token}`},
  body: JSON.stringify(consumoData)
});
const data = await response.json();
// Exibir: data.feedback_ia.feedback

// Solicitar dica personalizada
const response = await fetch('/dicas/ia/personalizada', {
  headers: {'Authorization': `Bearer ${token}`}
});
const data = await response.json();
// Exibir análise + dica
```

## 🚀 Deploy em Produção

### Variáveis de Ambiente Necessárias:

```
# API
DEBUG=False
ALLOWED_HOSTS=seu_dominio.com

# Banco de Dados (PostgreSQL recomendado)
DATABASE_URL=postgresql://usuario:senha@host:5432/sage_db

# Segurança
SECRET_KEY=gere_uma_chave_criptografica_forte_aqui
ALGORITHM=HS256

# IA
GEMINI_API_KEY=sua_chave_aqui

# Email
MAIL_USERNAME=seu_email@gmail.com
MAIL_PASSWORD=senha_app_específica
MAIL_FROM=noreply@seu_dominio.com
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
```

### Deploy em Render/Railway/Heroku:

1. Adicione variáveis de ambiente no painel
2. Use: `gunicorn app.main:app`
3. Certifique-se que PostgreSQL está configurado

## 📚 Documentação Completa

Para documentação detalhada da IA, consulte: **IA_GEMINI_DOCUMENTACAO.md**

## 💡 Próximos Passos

1. Customizar o frontend para exibir dicas
2. Implementar notificações push
3. Adicionar relatórios de economia
4. Integrar com mais tipos de consumo
5. Implementar gamificação

---

**Parabéns! Sua aplicação SAGE agora tem IA integrada! 🎉**

Para dúvidas ou problemas, consulte a documentação completa ou execute: `python test_ia_gemini.py`
