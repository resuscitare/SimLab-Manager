# ⚡ Guia Rápido de Implementação - SimLab Manager MVP
**Para Time de Desenvolvimento**

---

## 🎯 TL;DR - O Que Construir

**Produto:** Plataforma web para criar e gerenciar cenários de simulação médica com ajuda de IA

**Stack:**
- Frontend: React 18 + TypeScript + TailwindCSS
- Backend: Node.js 20 + Express + TypeScript
- Database: PostgreSQL 15+
- IA: OpenAI GPT-4o-mini ou Google Gemini

**Prazo MVP:** 3-4 meses | **Score de Complexidade:** 7/10

---

## 🏃 Sprint 0: Setup (Semana 1)

### Infraestrutura
```bash
# Estrutura monorepo
simlab-manager/
├── apps/
│   ├── web/          # Vite + React + TS
│   └── api/          # Express + TS
├── packages/
│   ├── types/        # Shared types
│   ├── ui/           # shadcn/ui components
│   └── config/       # ESLint, Prettier
└── docs/
```

### Ferramentas
- **CI/CD:** GitHub Actions
- **Deploy:** Vercel (frontend) + Railway (backend)
- **Database:** Supabase ou Railway PostgreSQL
- **Monitoring:** Sentry (errors) + Vercel Analytics
- **IA:** OpenAI API (começar com GPT-4o-mini)

### Checklist Setup
- [ ] Criar monorepo com Turborepo ou Nx
- [ ] Configurar TypeScript strict mode
- [ ] Setup ESLint + Prettier + Husky
- [ ] Configurar variáveis de ambiente (.env.example)
- [ ] Criar README com instruções de setup
- [ ] Setup banco de dados (migrations com Prisma ou Drizzle)
- [ ] Configurar CI/CD pipeline básico

---

## 🗄️ Database Schema - Prioridade ALTA

### Tabelas Core (MVP)

```sql
-- Usuários
users
├── id (uuid, PK)
├── nome (string)
├── email (string, unique)
├── senha_hash (string)
├── role (enum: 'admin', 'facilitador')
├── created_at (timestamp)
└── updated_at (timestamp)

-- Cenários
cenarios
├── id (uuid, PK)
├── user_id (uuid, FK → users)
├── status (enum: 'rascunho', 'publicado')
├── nome (string, NOT NULL)
├── palavras_chave (string[])
├── publico_alvo (string)
├── data_* (múltiplos campos conforme PRD)
├── created_at (timestamp)
├── updated_at (timestamp)
└── deleted_at (timestamp, nullable) -- soft delete

-- Frames de Cenário (1:N)
cenario_frames
├── id (uuid, PK)
├── cenario_id (uuid, FK → cenarios)
├── ordem (int)
├── nome_etapa (string)
├── fc, sato2, pa_* (campos clínicos)
├── info_simulador (text)
├── info_facilitador (text)
└── observacoes (text)

-- Checklists de Debriefing
checklists_debriefing
├── id (uuid, PK)
├── user_id (uuid, FK → users)
├── titulo (string)
├── secoes (jsonb) -- array de {titulo, itens[]}
└── created_at (timestamp)

-- Checklists de Materiais
checklists_materiais
├── id (uuid, PK)
├── user_id (uuid, FK → users)
├── titulo (string)
├── secoes (jsonb) -- array de {titulo, itens[{nome, quantidade}]}
└── created_at (timestamp)

-- Logs de IA (analytics)
ai_suggestions_log
├── id (uuid, PK)
├── user_id (uuid, FK → users)
├── cenario_id (uuid, FK → cenarios, nullable)
├── campo (string) -- qual campo foi sugerido
├── prompt_usuario (text)
├── sugestao_gerada (text)
├── tokens_usados (int)
├── tempo_ms (int)
├── avaliacao (enum: 'util', 'nao_util', null)
└── created_at (timestamp)
```

**Nota:** Use JSONB para campos flexíveis (secoes de checklists) para evitar muitas tabelas no MVP

---

## 🚀 Roadmap de Desenvolvimento - 12 Semanas

### 📅 Sprints 1-2: Autenticação e Infraestrutura (2 semanas)

**Épico 1:** Fundação

#### Sprint 1 (Semana 2)
- [ ] **Backend:** Endpoint de cadastro (`POST /api/auth/signup`)
  - Validação de e-mail e senha
  - Hash de senha com bcrypt (salt rounds 10)
  - Primeiro usuário = admin automático
- [ ] **Backend:** Endpoint de login (`POST /api/auth/login`)
  - Geração de JWT (expiração 30 dias)
  - Rate limiting (5 tentativas / 15min)
- [ ] **Frontend:** Páginas de Signup e Login
  - Formulários com validação
  - Feedback de erro inline
  - Redirecionamento pós-login

#### Sprint 2 (Semana 3)
- [ ] **Backend:** Middleware de autenticação JWT
- [ ] **Backend:** Endpoint de perfil (`GET /api/auth/me`)
- [ ] **Backend:** CRUD de usuários (apenas admin)
- [ ] **Frontend:** Layout base com sidebar
- [ ] **Frontend:** Proteção de rotas (PrivateRoute)
- [ ] **Frontend:** Página de gerenciamento de usuários (admin)

**Entrega Sprint 2:** Sistema de autenticação completo e funcional

---

### 📅 Sprints 3-6: CRUD de Cenários (4 semanas)

**Épico 2:** Core - Gerenciamento de Cenários

#### Sprint 3 (Semana 4)
- [ ] **Backend:** Modelo de dados de Cenário (Prisma/Drizzle)
- [ ] **Backend:** Endpoints básicos
  - `POST /api/cenarios` (criar)
  - `GET /api/cenarios` (listar com paginação)
  - `GET /api/cenarios/:id` (buscar um)
- [ ] **Frontend:** Página de listagem de cenários
  - Cards com nome, status, autor, data
  - Filtros: Meus/Todos, Status
  - Busca por nome

#### Sprint 4 (Semana 5)
- [ ] **Frontend:** Formulário de criação - Parte 1
  - Estrutura de abas (7 seções)
  - Seção 1: Identificação do Programa
  - Seção 2: Identificação do Cenário
  - Navegação entre abas
  - Salvamento de rascunho

#### Sprint 5 (Semana 6)
- [ ] **Frontend:** Formulário de criação - Parte 2
  - Seção 3: Descrição e Início
  - Seção 4: Perfil do Paciente
  - Seção 5: Frames do Cenário (tabela dinâmica)
  - Validação de campos obrigatórios

#### Sprint 6 (Semana 7)
- [ ] **Frontend:** Formulário de criação - Parte 3
  - Seção 6: Direcionamento e Preparo
  - Seção 7: Debriefing
  - Auto-save a cada 60s
- [ ] **Backend:** Endpoints de atualização
  - `PUT /api/cenarios/:id` (editar)
  - `DELETE /api/cenarios/:id` (soft delete)
- [ ] **Frontend:** Página de visualização de cenário
  - Layout de leitura otimizado
  - Botões: Editar, Duplicar, Excluir, Exportar PDF

**Entrega Sprint 6:** CRUD completo de cenários funcionando

---

### 📅 Sprints 7-8: Checklists (2 semanas)

**Épico 3:** Checklists - Debriefing e Materiais

#### Sprint 7 (Semana 8)
- [ ] **Backend:** Modelo e endpoints de Checklists
  - `POST /api/checklists/debriefing`
  - `GET /api/checklists/debriefing`
  - Endpoints de materiais similares
- [ ] **Frontend:** CRUD de checklist de debriefing
  - Interface de criação com seções e itens
  - Drag and drop para reordenar

#### Sprint 8 (Semana 9)
- [ ] **Frontend:** CRUD de checklist de materiais
  - Similar ao debriefing
  - Campo de quantidade
- [ ] **Frontend:** Associação de checklists a cenários
  - Dropdown de seleção no formulário de cenário
  - Preview do checklist selecionado
- [ ] **Backend:** Vincular checklists a cenários (FK)

**Entrega Sprint 8:** Sistema de checklists completo

---

### 📅 Sprints 9-11: IA Generativa (3 semanas)

**Épico 4:** IA - Assistência Contextual

#### Sprint 9 (Semana 10)
- [ ] **Backend:** Integração com OpenAI API
  - Configuração de chave de API (env var)
  - Função de prompt engineering
  - Endpoint `POST /api/ai/suggest`
  - Rate limiting (20 sugestões/cenário)

#### Sprint 10 (Semana 11)
- [ ] **Frontend:** UI do botão "Sugerir com IA"
  - Botão nos 3 campos principais
  - Modal de geração de sugestão
  - Campo de prompt livre
  - Loading state e timeout visual
- [ ] **Frontend:** Exibição e ações com sugestão
  - Copiar, Inserir, Anexar
  - Avaliação 👍/👎

#### Sprint 11 (Semana 12)
- [ ] **Backend:** Sistema de logs de IA
  - Salvar cada chamada no banco
  - Métricas: tokens, tempo, avaliação
- [ ] **Frontend:** Dashboard de métricas (admin)
  - Total de sugestões
  - Custo acumulado
  - Taxa de aprovação
  - Tabela de logs recentes

**Entrega Sprint 11:** Feature de IA completa e com monitoramento

---

### 📅 Sprint 12: Polish e Preparação para Launch (1 semana)

#### Semana 13
- [ ] **Geral:** Testes end-to-end
- [ ] **Geral:** Ajustes de UX baseados em testes internos
- [ ] **Frontend:** Exportação para PDF (cenários)
- [ ] **Backend:** Otimizações de performance
- [ ] **DevOps:** Setup de monitoring (Sentry, logs)
- [ ] **Docs:** README atualizado, API docs
- [ ] **Security:** Audit de segurança (OWASP checklist)

**Entrega Sprint 12:** MVP pronto para beta testing

---

## 🎯 Features por Prioridade - MoSCoW

### ✅ MUST (Não lança sem)
1. ✅ Autenticação (signup, login, JWT)
2. ✅ CRUD de cenários (criar, editar, listar, visualizar)
3. ✅ Formulário completo (7 seções, todos os campos do PRD)
4. ✅ CRUD de checklists (debriefing + materiais)
5. ✅ Associação checklists ↔ cenários
6. ✅ Sugestão de IA (3 campos: objetivos, perfil, debriefing)
7. ✅ Busca e filtros em cenários
8. ✅ Soft delete (não perder dados)
9. ✅ Auto-save a cada 60s
10. ✅ Responsivo (desktop + tablet)

### 🟡 SHOULD (Importante, mas negociável)
1. 🟡 Recuperação de senha por e-mail
2. 🟡 Duplicar cenário
3. 🟡 Exportar cenário para PDF
4. 🟡 Dashboard de métricas de IA (admin)
5. 🟡 Imprimir checklist de materiais

### 🔵 COULD (Nice-to-have)
1. 🔵 Edição de perfil (nome, avatar)
2. 🔵 Tags customizadas em cenários
3. 🔵 Histórico de sugestões de IA do usuário
4. 🔵 Modo apresentação para checklists (marcar concluído)

### 🚫 WON'T (Pós-MVP)
1. 🚫 Colaboração em tempo real
2. 🚫 Versionamento de cenários
3. 🚫 Templates pré-configurados
4. 🚫 SSO (Google, Microsoft)
5. 🚫 App mobile nativo

---

## 🔐 Requisitos de Segurança - CRÍTICO

### Checklist de Segurança

- [ ] **Senhas:** bcrypt com salt rounds ≥10, nunca em plain text
- [ ] **JWT:** httpOnly cookies, secure flag em produção
- [ ] **HTTPS:** Forçar TLS 1.2+ em produção
- [ ] **CORS:** Configurado apenas para domínios permitidos
- [ ] **Rate Limiting:** 
  - Login: 5 tentativas / 15min
  - IA: 20 sugestões / cenário
  - Endpoints públicos: 100 req/min
- [ ] **Sanitização:** Validar e sanitizar todos os inputs (prevenir XSS, SQL Injection)
- [ ] **Secrets:** Chaves de API em variáveis de ambiente, NUNCA no código
- [ ] **Headers:** Usar Helmet.js (Content-Security-Policy, X-Frame-Options, etc)
- [ ] **LGPD:** Consentimento explícito, direito a exclusão implementado

---

## ⚡ Performance Targets

### Frontend
```
Target                         Métrica
────────────────────────────────────────
Time to First Byte (TTFB)      < 600ms
First Contentful Paint (FCP)   < 1.8s
Largest Contentful Paint (LCP) < 2.5s
Time to Interactive (TTI)      < 3.8s
Cumulative Layout Shift (CLS)  < 0.1
```

### Backend
```
Endpoint                       Target
────────────────────────────────────────
GET /api/cenarios              < 500ms
POST /api/cenarios             < 1s
POST /api/ai/suggest           < 10s (P90)
GET /api/auth/me               < 200ms
```

### Database
- Queries principais: < 100ms
- Usar índices em: user_id, status, created_at
- Paginação: 20 itens/página

---

## 🧪 Estratégia de Testes

### Pirâmide de Testes
```
        /\
       /e2e\       5%  - Cypress (fluxos críticos)
      /──────\
     /integ.  \    20% - API tests (Supertest)
    /──────────\
   /   unit     \  75% - Jest (lógica de negócio)
  /──────────────\
```

### Testes Críticos (MUST)
1. ✅ Autenticação (signup, login, logout)
2. ✅ CRUD de cenários (criar, editar, listar, deletar)
3. ✅ Sugestão de IA (prompt → resposta)
4. ✅ Permissões (admin vs facilitador)
5. ✅ Auto-save (não perder dados)

### Cobertura Mínima
- Backend: 60% (lógica crítica: 80%)
- Frontend: 40% (componentes core)

---

## 📊 Monitoramento e Observabilidade

### Logs Estruturados
```typescript
// Formato JSON para facilitar parsing
{
  timestamp: "2025-10-22T10:30:00Z",
  level: "info|warn|error",
  service: "api|web",
  message: "Descrição",
  context: {
    user_id: "uuid",
    endpoint: "/api/cenarios",
    // ... dados adicionais
  }
}
```

### Métricas para Alertar
- ⚠️ Taxa de erro > 5% em 5min
- ⚠️ Tempo de resposta P95 > 3s
- ⚠️ Custo de IA > $50/dia
- ⚠️ Uptime < 99% em 24h

### Dashboards Recomendados
1. **Visão Geral:** Uptime, requests/min, erros/min
2. **Performance:** Latência P50/P95/P99, throughput
3. **IA:** Sugestões/dia, custo/dia, taxa de aprovação
4. **Usuários:** Cadastros/dia, MAU, cenários criados/dia

---

## 💰 Estimativa de Custos (Mensal)

```
Infraestrutura
├── Vercel (Frontend)        $20-50
├── Railway (Backend)        $20-40
├── PostgreSQL (DB)          $15-25
├── OpenAI API (IA)          $500-2000 ⚠️
├── Sentry (Monitoring)      $0 (free tier)
└── Domínio                  $1-2
───────────────────────────────────────
Total Estimado:              $556-2117/mês
```

**Maior variável:** Custo de IA depende do uso. Monitorar desde dia 1!

**Estratégias de Redução:**
- Cache de sugestões similares
- Rate limiting rigoroso
- Modelo mais barato (GPT-4o-mini vs GPT-4)

---

## 🚨 Red Flags - Quando Alertar PM

Alerte o PM imediatamente se:
- 🔴 Custo de IA > $100/dia por 3 dias seguidos
- 🔴 Tempo de resposta de IA consistentemente > 15s
- 🔴 Taxa de erro da API de IA > 10%
- 🔴 Qualidade de sugestões (👍) < 50%
- 🔴 Sprint atraso > 20% do planejado
- 🔴 Bugs críticos (perda de dados, falha de autenticação)

---

## 🎓 Recursos Úteis

### Documentação Técnica
- **React + TypeScript:** https://react.dev
- **Tailwind CSS:** https://tailwindcss.com
- **shadcn/ui:** https://ui.shadcn.com
- **Express:** https://expressjs.com
- **Prisma:** https://www.prisma.io/docs
- **OpenAI API:** https://platform.openai.com/docs

### Prompt Engineering para IA
```typescript
// Exemplo de prompt estruturado
const buildPrompt = (context, userPrompt) => `
Você é um especialista em simulação realística em saúde.
Contexto: Cenário "${context.nome_cenario}" para ${context.publico_alvo}.
Tarefa: Gerar ${context.campo} de alta qualidade.
Input do usuário: "${userPrompt}"

Diretrizes:
- Seja específico e prático
- Use terminologia médica adequada
- Foque em objetivos de aprendizagem mensuráveis (se aplicável)
- Máximo 300 palavras

Resposta:
`;
```

---

## ✅ Checklist de Pronto para Launch

### Funcional
- [ ] Todos os MUST features implementados
- [ ] Testes E2E passando (fluxos críticos)
- [ ] Testado em Chrome, Firefox, Safari
- [ ] Responsivo (desktop 1920px + tablet 1024px)

### Performance
- [ ] Lighthouse score > 85 (performance)
- [ ] P95 load time < 3s
- [ ] IA response time P90 < 10s

### Segurança
- [ ] Audit de segurança completo (OWASP)
- [ ] Secrets não commitados no repo
- [ ] HTTPS configurado
- [ ] Rate limiting ativo

### Observabilidade
- [ ] Logs estruturados implementados
- [ ] Sentry configurado e testado
- [ ] Dashboards de métricas funcionando
- [ ] Alertas configurados

### Documentação
- [ ] README atualizado com setup
- [ ] API docs gerada (Swagger)
- [ ] Guia de deploy documentado
- [ ] Runbook de operações

---

## 🎉 Entrega Final

**MVP Completo = 52 requisitos MUST implementados + 28 NFRs atendidos**

**Critérios de Sucesso Técnico:**
- ✅ 100% dos features MUST funcionando
- ✅ Uptime > 99% em staging
- ✅ 0 bugs críticos conhecidos
- ✅ Testes E2E passando
- ✅ Performance targets atingidos

**Pronto para:** Beta testing com 10-20 usuários piloto

---

## 🚀 Boa Sorte!

Este guia é sua estrela-guia para construir o MVP do SimLab Manager em 12 semanas.

**Lembre-se:**
- 🎯 Foco no MVP - resista ao scope creep
- 🔄 Iteração > Perfeição na primeira tentativa
- 📊 Métricas > Opiniões
- 🤝 Comunicação constante com PM e UX
- 🐛 Bugs são inevitáveis, mitigação é essencial

**Qualquer dúvida, consulte o PRD completo em `/docs/PRD_SimLab_Manager_OTIMIZADO.md`**

---

**Guia criado por:** Claude (Consultor de Produto)  
**Data:** 22/10/2025  
**Versão:** 1.0
