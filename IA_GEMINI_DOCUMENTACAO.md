# 🌱 SAGE App - Integração de IA Gemini

## 📋 Visão Geral

O SAGE App agora possui uma IA integrada usando o **Google Gemini** para gerar dicas personalizadas de consumo sustentável. A IA analisa o histórico de consumo do usuário e oferece recomendações específicas em tempo real.

## 🎯 Funcionalidades

### 1. **Dica Genérica ao Fazer Login**
- Quando o usuário faz login, a API retorna uma dica genérica de sustentabilidade
- Útil para engajar o usuário e motivá-lo
- Exemplo: "Desligue os aparelhos da tomada quando não estiverem em uso..."

### 2. **Dica Genérica Sob Demanda**
- Endpoint: `GET /dicas/ia/genérica`
- Parâmetro opcional: `tipo_consumo` (energia, agua, etc)
- Retorna uma dica genérica personalizada por tipo

### 3. **Dica Personalizada Baseada em Histórico**
- Endpoint: `GET /dicas/ia/personalizada`
- A IA analisa o histórico de consumo dos últimos 30 dias
- Identifica padrões e áreas de melhoria
- Retorna uma dica específica para o usuário
- Exemplo: "Você consumiu 150 litros de água em uma semana. Sugerimos tomar banhos mais curtos..."

### 4. **Feedback Imediato ao Registrar Consumo**
- Quando o usuário registra um novo consumo via `POST /consumo/`
- A API gera automaticamente um feedback
- Compara com o histórico anterior
- Retorna percentual de variação e uma dica específica
- Exemplo: "Seu consumo de energia aumentou 15% em relação à média. Sugerimos revisar os aparelhos em standby."

### 5. **Histórico de Dicas**
- Endpoint: `GET /dicas/ia/historico`
- Lista todas as dicas geradas para o usuário
- Útil para revisar recomendações passadas

## 🔧 Configuração

### Pré-requisitos
```bash
pip install google-generativeai python-dotenv
```

### Variáveis de Ambiente
Adicione ao arquivo `.env`:
```
GEMINI_API_KEY=sua_chave_api_aqui
```

**Como obter a chave:**
1. Acesse: https://aistudio.google.com/app/apikeys
2. Clique em "Create API Key"
3. Copie a chave gerada
4. Cole no `.env`

## 📊 Fluxo de Dados

### Ao Fazer Login
```
[Usuario Login]
    ↓
[validar credenciais]
    ↓
[gerar token JWT]
    ↓
[IA gera dica genérica]
    ↓
[Retorna: token + usuario + dica_boas_vindas]
```

### Ao Registrar Consumo
```
[Usuario registra consumo]
    ↓
[Salvar no BD]
    ↓
[IA analisa histórico anterior]
    ↓
[Compara com novo consumo]
    ↓
[Gera feedback personalizado]
    ↓
[Retorna: consumo + feedback]
```

### Ao Solicitar Dica Personalizada
```
[Usuario solicita /dicas/ia/personalizada]
    ↓
[IA busca histórico 30 dias]
    ↓
[Calcula padrões e estatísticas]
    ↓
[Gera análise completa]
    ↓
[Retorna: dica + análise]
```

## 🚀 Exemplos de API

### 1. Login com Dica
```bash
POST /usuarios/login
{
  "email": "usuario@example.com",
  "senha": "senha123"
}

# Resposta
{
  "status": "Sucesso",
  "token_acesso": "eyJ0eXAiOiJKV1Q...",
  "usuario": {
    "id": 1,
    "nome": "João Silva",
    "email": "usuario@example.com"
  },
  "dica_boas_vindas": {
    "status": "Sucesso",
    "titulo": "⚡ Dica de Economia de Energia",
    "dica": "Desligue os aparelhos da tomada quando não estiverem em uso. O modo 'standby' consome até 20% de energia desnecessária!",
    "tipo": "energia",
    "data": "2024-05-05T10:30:00"
  }
}
```

### 2. Registrar Consumo com Feedback
```bash
POST /consumo/
Authorization: Bearer {token}
{
  "tipo_consumo": "agua",
  "quantidade": 180,
  "unidade": "litros",
  "preco": 45.50,
  "data": "2024-05-05",
  "simulacao": false
}

# Resposta
{
  "status": "Sucesso",
  "consumo": {
    "id": 1,
    "tipo_consumo": "agua",
    "quantidade": 180,
    "data": "2024-05-05"
  },
  "feedback_ia": {
    "status": "Sucesso",
    "feedback": "Você registrou 180 litros de água. Isso é 20% MAIS que sua média anterior (150L). Sugerimos: instale aeradores em torneiras e duches para reduzir consumo sem perder conforto.",
    "comparacao": {
      "consumo_registrado": 180,
      "media_anterior": 150,
      "diferenca": 30,
      "percentual_diferenca": "20.0%"
    }
  }
}
```

### 3. Dica Personalizada
```bash
GET /dicas/ia/personalizada
Authorization: Bearer {token}

# Resposta
{
  "status": "Sucesso",
  "dica": "Nos últimos 30 dias você consumiu principalmente água (1200L) e energia. Seus horários de consumo pico são às 10h e 18h. Recomendamos usar programas eco na máquina de lavar após as 22h para economizar até 30%.",
  "tipo": "agua",
  "analise": {
    "consumo_total": 1200,
    "gasto_total": "R$ 300.00",
    "tipos_consumo": ["agua", "energia"]
  }
}
```

### 4. Histórico de Dicas
```bash
GET /dicas/ia/historico?limite=5
Authorization: Bearer {token}

# Resposta
{
  "status": "Sucesso",
  "total": 5,
  "dicas": [
    {
      "id": 1,
      "titulo": "💡 Dica Personalizada - Agua",
      "dica": "Você consumiu 180 litros...",
      "tipo": "agua",
      "data": "2024-05-05T10:30:00"
    }
  ]
}
```

## 📱 Fluxo de UI Recomendado

### Tela de Login
1. Usuario entra com email/senha
2. App recebe token + dica
3. Exibe dica em banner/notificação
4. Navega para dashboard

### Tela de Registrar Consumo
1. Usuario preenche formulário de consumo
2. Clica "Registrar"
3. Recebe feedback imediato com a dica
4. Mostra comparação com histórico
5. Exibe ação recomendada

### Tela de Dicas
1. Menu "Meus Conselhos" ou "Dicas"
2. Opção: "Gerar Dica" (busca /dicas/ia/personalizada)
3. Lista: "Histórico de Dicas" (/dicas/ia/historico)
4. Exibe todas as dicas geradas

## 🔐 Segurança

- ✅ Todas as requisições requerem autenticação JWT
- ✅ Dados de consumo são isolados por usuário
- ✅ Chave da API do Gemini deve estar em variável de ambiente
- ✅ Dicas são armazenadas no BD para auditoria

## ⚙️ Estrutura de Arquivos

```
app/
├── ai/
│   └── gemini_service.py          # Serviço principal de IA
├── src/
│   ├── services/
│   │   └── dicas_service.py       # Orquestrador de dicas
│   ├── routes/
│   │   ├── dicas_route.py         # Endpoints de dicas
│   │   ├── consumo_route.py       # Integração com IA
│   │   └── usuario_route.py       # Login com dica
│   ├── models/
│   │   └── dica_model.py          # Modelo BD de dicas
│   └── schemas/
│       └── dica_schema.py         # Schema Pydantic
```

## 📊 Banco de Dados

Nova tabela criada:
```sql
CREATE TABLE dicas (
    id INTEGER PRIMARY KEY,
    titulo VARCHAR,
    descricao TEXT,
    tipo_consumo VARCHAR,
    usuario_id INTEGER FOREIGN KEY,
    data_criacao DATETIME DEFAULT NOW()
)
```

## 🐛 Troubleshooting

### "Chave da API Gemini não configurada"
- Verifique se `GEMINI_API_KEY` está no `.env`
- Reinicie o servidor após adicionar a variável

### "Usuário não encontrado"
- Verifique se o token é válido
- Confirme se o usuário existe no BD

### "Erro ao gerar dica"
- Pode ser limite de quota da API Gemini
- Verifique internet
- Verifique se a chave é válida

## 🚀 Próximas Melhorias

- [ ] Cache de dicas para reutilização
- [ ] Relatório mensal de economia sugerida
- [ ] Dicas por horário do dia
- [ ] Sistema de gamificação (badges de sustentabilidade)
- [ ] Comparação com outros usuários (anônima)
- [ ] Integração com mais tipos de consumo

---

**Desenvolvido com ❤️ para um futuro mais sustentável**
