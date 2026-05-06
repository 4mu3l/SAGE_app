# 🎨 Diagrama Visual - Integração IA Gemini

## 📊 Fluxo de Dados Completo

```
╔═══════════════════════════════════════════════════════════════════════╗
║                         🌱 SAGE APP COM IA                            ║
╚═══════════════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────────────┐
│                    USUÁRIO / CLIENTE FRONTEND                        │
│  (Web, Mobile, Desktop)                                              │
└────────────────────┬────────────────────────────────────────────────┘
                     │
      ┌──────────────┼──────────────┬──────────────┐
      │              │              │              │
      ▼              ▼              ▼              ▼
   LOGIN          CADASTRO      CONSUMO       DICA?
      │              │              │              │
      └──────────────┼──────────────┴──────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         FastAPI (REST API)                           │
├─────────────────────────────────────────────────────────────────────┤
│  POST /usuarios/login        → token + usuario + 💡 dica genérica   │
│  POST /usuarios/             → usuario + 💡 dica boas-vindas       │
│  POST /consumo/              → consumo + 💡 feedback IA             │
│  GET  /dicas/ia/genérica     → 💡 dica genérica                     │
│  GET  /dicas/ia/personalizada → 💡 dica personalizada               │
│  GET  /dicas/ia/historico    → lista de 💡 dicas                    │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
           ┌───────────────────┼───────────────────┐
           │                   │                   │
           ▼                   ▼                   ▼
    ┌────────────────┐ ┌─────────────────┐ ┌──────────────┐
    │  Serviços      │ │   Validações    │ │  Autenticação│
    ├────────────────┤ ├─────────────────┤ ├──────────────┤
    │ usuario_svc    │ │    Pydantic     │ │     JWT      │
    │ consumo_svc    │ │  Schemas        │ │              │
    │ dicas_svc      │ │                 │ │              │
    └────────┬───────┘ └─────────────────┘ └──────────────┘
             │
             ▼
    ┌──────────────────────────────────────────────┐
    │     🤖 AI SERVICE (gemini_service.py)         │
    ├──────────────────────────────────────────────┤
    │ • obter_historico_consumos()                 │
    │ • gerar_dica_genérica()                      │
    │ • gerar_dica_personalizada()                 │
    │ • gerar_dica_apos_novo_consumo()            │
    │ • obter_ultimas_dicas()                      │
    └────────────┬─────────────────────────────────┘
                 │
                 ▼
    ┌──────────────────────────────────────────────┐
    │      🔗 Google Generative AI (Gemini)        │
    ├──────────────────────────────────────────────┤
    │ • Análise de padrões                         │
    │ • Geração de dicas personalizadas            │
    │ • Processamento de linguagem natural         │
    │ • Recomendações baseadas em dados           │
    └────────────┬─────────────────────────────────┘
                 │
    ┌────────────┴──────────────┐
    │                           │
    ▼                           ▼
┌──────────────────────┐  ┌──────────────────────┐
│  Dados Históricos    │  │  Dados Atualizados   │
│  (Últimos 30 dias)   │  │  (Novo Consumo)      │
└──────────────────────┘  └──────────────────────┘
    │                           │
    └────────────┬──────────────┘
                 │
    ┌────────────▼──────────────┐
    │   Análise e Contexto      │
    │  • Padrões detectados     │
    │  • Comparações            │
    │  • Tendências             │
    └────────────┬──────────────┘
                 │
                 ▼
         ┌──────────────────┐
         │ 💡 DICA FINAL   │
         ├──────────────────┤
         │ • Título         │
         │ • Descrição      │
         │ • Tipo consumo   │
         │ • Data criação   │
         └────────┬─────────┘
                  │
                  ▼
         ┌──────────────────┐
         │ SQLAlchemy ORM   │
         └─────────┬────────┘
                   │
                   ▼
         ┌──────────────────┐
         │  Banco de Dados  │
         ├──────────────────┤
         │ • usuarios       │
         │ • consumos       │
         │ • dicas ← NOVA   │
         │ • metas          │
         └──────────────────┘
```

---

## 🔄 Ciclo de Vida de uma Dica

```
ETAPA 1: TRIGGER
├─ Login do usuário
├─ Cadastro novo
├─ Novo consumo registrado
└─ Solicitar dica (manual)

         ▼

ETAPA 2: BUSCA DE DADOS
├─ Verificar autenticação
├─ Buscar histórico (30 dias)
├─ Buscar consumos anteriores
└─ Calcular estatísticas

         ▼

ETAPA 3: PREPARAÇÃO PARA IA
├─ Formatar dados
├─ Preparar contexto
├─ Montar prompt
└─ Validar inputs

         ▼

ETAPA 4: CHAMADA À IA (Gemini)
├─ Enviar prompt + dados
├─ Aguardar resposta
└─ Processar resultado

         ▼

ETAPA 5: PROCESSAMENTO
├─ Validar resposta
├─ Extrair dica
├─ Formatar saída
└─ Tratar erros

         ▼

ETAPA 6: ARMAZENAMENTO
├─ Criar registro de dica
├─ Salvar no BD
├─ Associar com usuário
└─ Registrar timestamp

         ▼

ETAPA 7: RESPOSTA
├─ Retornar JSON
├─ Incluir metadados
├─ Enviar ao cliente
└─ ✅ Dica entregue!
```

---

## 📱 Casos de Uso

```
┌─────────────────────────────────────────────────────────────┐
│                    CASO 1: PRIMEIRO ACESSO                   │
├─────────────────────────────────────────────────────────────┤
│  1. Usuário clica "Cadastrar"                               │
│  2. Preenche formulário                                     │
│  3. API recebe POST /usuarios/                             │
│  4. ✅ Valida dados                                         │
│  5. 🤖 IA gera dica boas-vindas                            │
│  6. 💾 Salva dica no BD                                     │
│  7. ✅ Retorna: dados + dica                               │
│  8. Frontend exibe: "Bem-vindo! 💡 [Dica]"                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    CASO 2: PRÓXIMO LOGIN                     │
├─────────────────────────────────────────────────────────────┤
│  1. Usuário entra email/senha                              │
│  2. API recebe POST /usuarios/login                       │
│  3. ✅ Valida credenciais                                   │
│  4. 🔓 Gera JWT token                                      │
│  5. 🤖 IA gera dica genérica                              │
│  6. 💾 Salva dica no BD                                    │
│  7. ✅ Retorna: token + usuario + dica                    │
│  8. Frontend: "Login OK! 💡 [Dica do Dia]"                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              CASO 3: REGISTRAR NOVO CONSUMO                  │
├─────────────────────────────────────────────────────────────┤
│  1. Usuário registra: "150L água"                          │
│  2. API recebe POST /consumo/                              │
│  3. ✅ Valida dados (JWT, quantidade, etc)                 │
│  4. 💾 Salva consumo no BD                                  │
│  5. 📊 Busca histórico anterior                            │
│  6. 🔢 Compara: 150L vs média 120L                        │
│  7. 🤖 IA gera feedback com recomendação                  │
│  8. 💾 Salva dica no BD                                    │
│  9. ✅ Retorna: consumo + feedback                         │
│  10. Frontend: "Consumo +25%! 💡 [Dica]"                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│           CASO 4: SOLICITAR DICA PERSONALIZADA              │
├─────────────────────────────────────────────────────────────┤
│  1. Usuário clica "Ver Minha Dica"                          │
│  2. API recebe GET /dicas/ia/personalizada               │
│  3. ✅ Valida JWT                                           │
│  4. 📊 Busca histórico 30 dias                             │
│  5. 🔢 Calcula: consumo total, média diária, picos       │
│  6. 🤖 IA analisa e gera recomendação específica          │
│  7. 💾 Salva dica no BD                                    │
│  8. ✅ Retorna: dica + análise completa                    │
│  9. Frontend exibe análise em gráficos                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Arquitetura de Segurança

```
┌──────────────────────────────────────────────────────────────┐
│                      CAMADAS DE SEGURANÇA                     │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  🔒 CAMADA 1: Autenticação                                  │
│  └─ JWT Token (válido por 24h)                             │
│     └─ Refresh Token (rotação)                             │
│                                                              │
│  🔒 CAMADA 2: Autorização                                  │
│  └─ Usuário só acessa seus dados                          │
│     └─ Admin vê logs e auditoria                          │
│                                                              │
│  🔒 CAMADA 3: Validação de Input                           │
│  └─ Pydantic Schemas                                       │
│     └─ Tipo checking                                       │
│     └─ Range validation                                    │
│                                                              │
│  🔒 CAMADA 4: Variáveis de Ambiente                        │
│  └─ GEMINI_API_KEY em .env (não em código)               │
│     └─ SECRET_KEY forte                                   │
│     └─ DATABASE_URL protegida                             │
│                                                              │
│  🔒 CAMADA 5: Banco de Dados                               │
│  └─ Foreign Keys (integridade)                            │
│     └─ CASCADE delete (limpeza)                           │
│     └─ Índices (performance)                              │
│                                                              │
│  🔒 CAMADA 6: Error Handling                               │
│  └─ Erros não expõem dados                               │
│     └─ Logs estruturados                                 │
│     └─ Rate limiting (TODO)                              │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 📊 Tipos de Dicas Geradas

```
┌─────────────────────────────────────────────────────────────┐
│                    TIPO 1: GENÉRICA                          │
├─────────────────────────────────────────────────────────────┤
│  Quando: Login, cadastro, sob demanda                      │
│  Exemplo: "Desligue os aparelhos da tomada quando não      │
│           estiverem em uso. O modo standby consome..."    │
│  Emoji: 💡 ou ⚡ ou 💧 ou 🌱                              │
│  Armazenada: ✅ Sim                                         │
│  IA Input: tipo_consumo (opcional)                        │
│  IA Output: texto livre 2-3 linhas                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              TIPO 2: PERSONALIZADA (Completa)               │
├─────────────────────────────────────────────────────────────┤
│  Quando: Solicitado por usuário                           │
│  Exemplo: "Você consumiu principalmente água (1200L)       │
│           nos últimos 30 dias. Seus horários pico são...  │
│           Recomendamos programas eco..."                  │
│  Emoji: 💡 + 📊                                            │
│  Armazenada: ✅ Sim                                         │
│  IA Input: histórico completo + estatísticas             │
│  IA Output: texto detalhado 3-5 linhas                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              TIPO 3: FEEDBACK (Imediato)                    │
├─────────────────────────────────────────────────────────────┤
│  Quando: Logo após novo consumo                           │
│  Exemplo: "Você registrou 150L de água. Isso é 20%       │
│           MAIS que sua média (125L). Sugerimos...         │
│           para economizar até 30%."                       │
│  Emoji: 📊 ou 💬                                           │
│  Armazenada: ✅ Sim                                         │
│  IA Input: novo consumo + comparação histórica           │
│  IA Output: feedback comparativo + ação                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              TIPO 4: HISTÓRICO (Listado)                    │
├─────────────────────────────────────────────────────────────┤
│  Quando: Usuário solicita histórico                       │
│  Exemplo: Lista das últimas 10 dicas                     │
│  Emoji: 📋                                                 │
│  Armazenada: ✅ Já estava                                  │
│  IA Input: nenhum (apenas busca BD)                       │
│  IA Output: nenhum (apenas listagem)                     │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚙️ Stack Técnico

```
┌────────────────────────────────────────────────────────────┐
│                    ARQUITETURA TÉCNICA                      │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  🌐 Frontend                          [Cliente: Web/Mobile]│
│  ↓                                                          │
│  🔗 HTTPS/HTTP                        [Protocolo REST]    │
│  ↓                                                          │
│  🐍 FastAPI                           [Framework Python]   │
│  ├─ Routes (rotas)                                         │
│  ├─ Middleware (validação)                                │
│  ├─ Dependencies (injeção)                                │
│  └─ Error Handling (erros)                                │
│  ↓                                                          │
│  🔐 JWT & OAuth2                      [Autenticação]      │
│  ↓                                                          │
│  📦 Pydantic                          [Validação]          │
│  ├─ Request Schemas                                       │
│  └─ Response Schemas                                      │
│  ↓                                                          │
│  🤖 Gemini Service                    [IA Generativa]     │
│  ├─ Prompt Engineering                                    │
│  ├─ Context Building                                      │
│  └─ Response Processing                                   │
│  ↓                                                          │
│  📊 SQLAlchemy                        [ORM]               │
│  ├─ Models Mapping                                        │
│  ├─ Relationships                                         │
│  └─ Queries                                               │
│  ↓                                                          │
│  🗄️ Database                          [Storage]           │
│  ├─ SQLite (dev)                                          │
│  ├─ PostgreSQL (prod)                                     │
│  ├─ usuarios                                              │
│  ├─ consumos                                              │
│  └─ dicas ← NOVO                                          │
│                                                             │
└────────────────────────────────────────────────────────────┘

Dependencies:
├─ fastapi
├─ uvicorn
├─ sqlalchemy
├─ pydantic
├─ google-generativeai ← NOVO
├─ python-dotenv
├─ python-jose
├─ passlib
└─ [outros]
```

---

## 📈 Escalabilidade Futura

```
ATUAL (v1.0)                    FUTURO (v2.0)
└─ Gemini                       ├─ Gemini Pro
                                ├─ Claude (Anthropic)
                                └─ GPT-4 (OpenAI)

└─ IA Genérica                  ├─ Fine-tuned Model
                                ├─ Custom Embeddings
                                └─ RAG (Retrieval)

└─ Histórico 30 dias            ├─ Histórico ilimitado
                                ├─ Cache com Redis
                                └─ Vector DB

└─ Dica após consumo            ├─ Notificações push
                                ├─ Email automático
                                └─ SMS

└─ Relatório manual             ├─ Dashboard ML
                                ├─ Previsões
                                └─ Simulações

└─ Usuário individual           ├─ Comunidades
                                ├─ Competições
                                └─ Leaderboards
```

---

**Diagrama atualizado:** 05/05/2024
