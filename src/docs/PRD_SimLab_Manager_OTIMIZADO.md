# SimLab Manager - Product Requirements Document (PRD)
**Versão:** 1.0  
**Data:** 22/10/2025  
**Status:** Aprovado para Design e Arquitetura

---

## 📋 Sumário Executivo

**Produto:** SimLab Manager - Plataforma web para gerenciamento de simulações realísticas em saúde com assistência de IA.

**Problema:** Processo manual, descentralizado e ineficiente para criar e gerenciar cenários de simulação, resultando em inconsistências, retrabalho e preparação inadequada.

**Solução:** Plataforma centralizada que estrutura a criação de cenários seguindo o modelo do "Roteiro de Criação de Cenário", com IA generativa para acelerar e melhorar a qualidade do conteúdo.

**Público-Alvo:** Educadores, facilitadores, técnicos e gestores de laboratórios de simulação em instituições de saúde.

**ROI Esperado:**
- ⬆️ 40% de eficiência na criação de cenários
- ⬇️ 50% de erros na preparação de materiais
- ⬆️ Satisfação dos usuários e padronização de qualidade

---

## 🎯 Objetivos e Métricas de Sucesso

### Objetivos do Produto

| Objetivo | Métrica | Meta | Prazo |
|----------|---------|------|-------|
| Aumentar eficiência operacional | Tempo médio de criação de cenário | Redução de 40% | 6 meses pós-launch |
| Melhorar qualidade dos cenários | Score de qualidade (checklist validação) | ≥ 8/10 | 3 meses pós-launch |
| Reduzir erros operacionais | Incidentes reportados na preparação | Redução de 50% | 6 meses pós-launch |
| Adoção do produto | Usuários ativos mensais (MAU) | 100 usuários | 6 meses pós-launch |
| Satisfação do usuário | NPS (Net Promoter Score) | ≥ 40 | 3 meses pós-launch |

### KPIs de Acompanhamento

**Métricas de Uso:**
- Cenários criados por usuário/mês
- Taxa de conclusão de cenários iniciados
- Taxa de uso da funcionalidade de IA (% cenários usando sugestões)
- Tempo médio de criação de cenário (baseline vs atual)

**Métricas de Qualidade:**
- Taxa de edição pós-criação
- Score de completude dos cenários (campos preenchidos)
- Relevância das sugestões de IA (avaliação usuário: 👍/👎)

**Métricas Técnicas:**
- Tempo de resposta das sugestões de IA (target: <10s)
- Custo médio de IA por cenário criado
- Disponibilidade do sistema (uptime target: 99%)

---

## 📖 Contexto e Visão

### Situação Atual (AS-IS)

O processo de gerenciamento de simulações apresenta os seguintes desafios:

**Problemas Identificados:**
1. **Descentralização:** Cenários armazenados em arquivos locais, compartilhamento via e-mail/drive pessoal
2. **Inconsistência:** Falta de padronização na estrutura e qualidade dos cenários
3. **Ineficiência:** Retrabalho constante, dificuldade em reutilizar conteúdo existente
4. **Erros Operacionais:** Checklists manuais resultam em materiais faltantes nas simulações
5. **Barreira de Criação:** Criar cenários variados e de qualidade consome tempo excessivo

**Impacto:**
- Educadores gastam 3-5h criando um cenário completo
- 30-40% dos materiais necessários apresentam algum problema na preparação
- Baixa reutilização de conteúdo (cada educador "reinventa a roda")
- Qualidade inconsistente compromete os objetivos de aprendizagem

### Visão do Produto (TO-BE)

**SimLab Manager será a plataforma de referência para:**
1. Centralizar e estruturar o conhecimento de cenários de simulação
2. Acelerar a criação através de templates inteligentes e IA generativa
3. Padronizar a qualidade com base no modelo validado do "Roteiro de Criação"
4. Eliminar erros operacionais com checklists digitais integrados
5. Facilitar colaboração e reutilização de conteúdo entre educadores

**Diferencial Competitivo:**
- ✨ **Assistência de IA:** Primeira ferramenta do mercado com sugestões contextuais por IA
- 🎯 **Especialização:** Focado especificamente em simulação realística em saúde
- 🇧🇷 **Localização:** Interface e conteúdo em Português do Brasil
- 📋 **Completude:** Cobre todo o ciclo: cenário → materiais → debriefing

---

## 🎭 Personas e Casos de Uso

### Persona 1: Dra. Mariana - Facilitadora de Simulação
**Perfil:**
- Idade: 35 anos
- Cargo: Enfermeira docente e facilitadora de simulação
- Experiência: 5 anos com simulação realística

**Necessidades:**
- Criar cenários de qualidade rapidamente
- Reutilizar e adaptar cenários existentes
- Ter sugestões para variar os casos clínicos
- Garantir que todos os materiais estejam prontos no dia da simulação

**Dores:**
- "Passo horas criando um cenário do zero"
- "Sempre esqueço algum material importante"
- "Gostaria de mais variedade nos casos, mas não tenho tempo"

### Persona 2: Prof. Roberto - Gestor do Lab de Simulação
**Perfil:**
- Idade: 48 anos
- Cargo: Coordenador do Centro de Simulação
- Experiência: 12 anos em educação médica

**Necessidades:**
- Visibilidade de todos os cenários do laboratório
- Padronização e controle de qualidade
- Relatórios de uso e performance
- Gerenciar equipe de facilitadores

**Dores:**
- "Cada facilitador tem seu método, falta padronização"
- "Não sei quantos cenários temos nem a qualidade deles"
- "Perco tempo fazendo gestão manual"

### Persona 3: Lucas - Técnico de Simulação
**Perfil:**
- Idade: 28 anos
- Cargo: Técnico responsável pela preparação das estações
- Experiência: 3 anos

**Necessidades:**
- Checklists claros de materiais
- Saber antecipadamente o que precisa preparar
- Registrar o que foi usado para reposição

**Dores:**
- "Os checklists mudam de última hora"
- "Às vezes falta material porque não foi comunicado"
- "Difícil rastrear o que precisa repor"

---

## 🏗️ Escopo do MVP

### ✅ In Scope (Versão 1.0)

**Módulos Core:**
1. **Autenticação e Usuários**
   - Cadastro e login com e-mail/senha
   - Dois perfis: Administrador e Facilitador

2. **Gerenciamento de Cenários**
   - CRUD completo de cenários
   - Formulário estruturado baseado no "Roteiro de Criação"
   - Busca por nome e palavras-chave
   - Visualização e impressão

3. **Assistência de IA (MVP)**
   - Sugestões para 3 campos críticos:
     - Objetivos de Aprendizagem
     - Histórico Médico/Perfil do Paciente
     - Pontos Norteadores para Debriefing
   - Prompt livre do usuário
   - Copiar/adaptar sugestão

4. **Checklists**
   - CRUD de checklists de debriefing
   - CRUD de checklists de materiais
   - Associação 1:1 com cenários

**Features Principais:**
- Interface em Português do Brasil
- Design responsivo (desktop-first)
- Salvamento automático (draft)
- Exportação para PDF

### ❌ Out of Scope (Versão 1.0)

**Features Futuras:**
- [ ] Colaboração em tempo real (múltiplos editores)
- [ ] Versionamento e histórico de alterações
- [ ] Templates pré-configurados de cenários
- [ ] Biblioteca de recursos (imagens, vídeos)
- [ ] Integração com sistemas de agendamento
- [ ] Sistema de reviews e aprovações
- [ ] Analytics avançados e dashboards
- [ ] App mobile nativo
- [ ] Compartilhamento público de cenários
- [ ] API pública para integrações
- [ ] Sugestões de IA para mais campos
- [ ] Personalização de prompts de IA por usuário
- [ ] Fine-tuning de modelo de IA customizado

### 🎯 Premissas e Restrições

**Premissas:**
- Usuários têm acesso a navegador web moderno (Chrome, Firefox, Edge, Safari)
- Conexão de internet banda larga disponível
- Instituições aprovam uso de IA generativa para auxílio educacional
- Orçamento inicial para custos de API de IA disponível

**Restrições Técnicas:**
- Budget: Custos de API de IA devem ser monitorados
- Prazo: MVP em 3-4 meses
- Equipe: 1 Full-stack Dev + 1 Designer + 1 PM
- Infraestrutura: Cloud-first (PaaS/SaaS)

**Restrições de Negócio:**
- Conformidade com LGPD (dados pessoais)
- Conteúdo gerado por IA deve ser revisado por humanos
- Sem custos para usuários no MVP (freemium futuro)

---

## 📋 Requisitos Funcionais

### Priorização: MoSCoW
- **MUST**: Crítico para MVP, não pode lançar sem
- **SHOULD**: Importante, mas pode ser entregue em iteração seguinte
- **COULD**: Desejável se houver tempo
- **WON'T**: Fora do escopo do MVP

---

### 🔐 Autenticação e Gerenciamento de Usuários

| ID | Prioridade | Requisito |
|----|-----------|-----------|
| **FR1** | MUST | O sistema deve permitir cadastro de novos usuários com: nome completo, e-mail válido e senha (mínimo 8 caracteres) |
| **FR2** | MUST | O sistema deve permitir autenticação via e-mail e senha com sessão persistente |
| **FR3** | MUST | O sistema deve ter dois níveis de permissão:<br>• **Administrador**: CRUD de usuários, CRUD total de todo conteúdo, visualização de métricas<br>• **Facilitador**: CRUD de próprios cenários/checklists, visualização de todos os cenários |
| **FR4** | SHOULD | O sistema deve permitir recuperação de senha via e-mail |
| **FR5** | COULD | O sistema deve permitir edição de perfil (nome, avatar) |
| **FR6** | WON'T | SSO com provedores externos (Google, Microsoft) |

**Regras de Negócio:**
- RN1: E-mail deve ser único no sistema
- RN2: Primeiro usuário cadastrado automaticamente é Administrador
- RN3: Sessão expira após 30 dias de inatividade

---

### 📝 Módulo de Cenários

| ID | Prioridade | Requisito |
|----|-----------|-----------|
| **FR7** | MUST | O sistema deve permitir criação de novo cenário com navegação por abas/seções |
| **FR8** | MUST | O formulário de criação deve incluir TODOS os campos do "Roteiro de Criação de Cenário.pdf" organizados nas seguintes seções:<br><br>**1. Identificação do Programa**<br>• Nome do Programa<br>• Objetivos de Aprendizagem do Programa (texto longo)<br>• Palavras-chave (tags)<br>• Público-alvo (dropdown + texto)<br>• Datas (data de início e fim)<br>• Horários (hora início e fim)<br>• Facilitadores (multi-select ou texto)<br>• Conteúdo Prévio (texto longo)<br>• Avaliação (texto)<br>• Tarefas (lista)<br><br>**2. Identificação do Cenário**<br>• Nome do Cenário (obrigatório)<br>• Objetivos de Aprendizagem Técnicos (lista)<br>• Objetivos de Aprendizagem Não Técnicos (lista)<br>• Autoria: Escrito por, Atualizado por, Validado por (texto + datas)<br>• Local da simulação<br>• Tempo de execução do cenário (minutos)<br>• Voluntários necessários (número + descrição)<br>• Tempo de Debriefing (minutos)<br>• Tipo de simulação (radio: Simulador/Paciente Padronizado/Ambos)<br><br>**3. Descrição e Início**<br>• Descrição do Cenário para participante (texto longo)<br>• Como o cenário inicia (texto)<br><br>**4. Perfil do Paciente**<br>• Nome do paciente<br>• Sexo (M/F/Outro)<br>• Idade, Peso, Altura<br>• Perfil Físico, Técnico e Psicológico<br>• Histórico Médico: DM, HAS, Asma, Alergias, Etilismo, Tabagismo, Outros (checkboxes + texto)<br>• Acompanhamento médico atual<br>• Medicações em uso<br>• Cirurgias/Internações anteriores<br><br>**5. Frames do Cenário (Etapas)**<br>• Tabela dinâmica para definir pelo menos 3 etapas<br>• Cada frame contém: FC, SatO2, PA, FR, Temperatura, Outros Parâmetros<br>• Informações do Simulador/Operador<br>• Informações do Facilitador<br>• Observações<br>• Tipo de participante (Simulador/Paciente Padronizado/Staff)<br><br>**6. Direcionamento e Preparo**<br>• Falas direcionadoras<br>• Materiais e equipamentos (referência a checklist)<br>• Impressos necessários<br>• Preparo de montagem da estação<br><br>**7. Debriefing**<br>• Pontos Norteadores - Objetivos Técnicos<br>• Pontos Norteadores - Não Técnicos<br>• Metas de Segurança do Paciente<br>• Domínios de Desempenho<br>• Protocolos específicos<br>• Exemplos de Frases para facilitar discussão |
| **FR9** | MUST | O sistema deve permitir salvar cenário como rascunho (dados incompletos) ou publicar (validação de campos obrigatórios) |
| **FR10** | MUST | O sistema deve ter salvamento automático a cada 60 segundos durante edição |
| **FR11** | MUST | O sistema deve permitir visualização de cenário completo em formato de leitura otimizado |
| **FR12** | MUST | O sistema deve permitir edição de cenários existentes (apenas por criador ou admin) |
| **FR13** | MUST | O sistema deve permitir exclusão lógica de cenários (soft delete) com confirmação |
| **FR14** | MUST | O sistema deve exibir lista paginada (20 itens) de cenários com:<br>• Nome, Data criação, Autor, Status (Rascunho/Publicado)<br>• Filtros: Meus cenários / Todos<br>• Ordenação: Data (desc/asc), Nome (A-Z) |
| **FR15** | MUST | O sistema deve permitir busca por: Nome do Cenário, Palavras-chave, Nome do Autor |
| **FR16** | SHOULD | O sistema deve permitir duplicar um cenário existente |
| **FR17** | SHOULD | O sistema deve permitir exportar cenário individual para PDF formatado |
| **FR18** | COULD | O sistema deve permitir adicionar tags customizadas aos cenários |
| **FR19** | WON'T | Versionamento e histórico de alterações |

**Regras de Negócio:**
- RN4: Nome do Cenário é obrigatório (min 5 caracteres)
- RN5: Cenário só pode ser publicado se tiver ao menos: Nome, 1 Objetivo, Perfil do Paciente básico, 1 Frame
- RN6: Apenas criador ou admin pode editar/excluir
- RN7: Exclusão é lógica (flag deleted_at), não remove dados

---

### 🤖 Assistência de IA (Sugestões Contextuais)

| ID | Prioridade | Requisito |
|----|-----------|-----------|
| **FR20** | MUST | O sistema deve exibir botão "✨ Sugerir com IA" nos seguintes campos do formulário de cenário:<br>• Objetivos de Aprendizagem do Cenário (Técnicos e Não Técnicos)<br>• Histórico Médico / Perfil do Paciente<br>• Pontos Norteadores para Debriefing |
| **FR21** | MUST | Ao clicar em "Sugerir com IA", o sistema deve abrir modal com:<br>• Campo de texto para prompt livre do usuário (placeholder com exemplo)<br>• Botão "Gerar Sugestão"<br>• Indicador de loading durante geração<br>• Área para exibir sugestão gerada |
| **FR22** | MUST | O sistema deve enviar para backend: prompt do usuário + contexto relevante (nome cenário, público-alvo, campo sendo preenchido) |
| **FR23** | MUST | O sistema deve exibir sugestão gerada com opções:<br>• Copiar para clipboard<br>• Inserir no campo (substitui)<br>• Anexar ao campo (adiciona ao existente)<br>• Gerar nova sugestão<br>• Fechar sem usar |
| **FR24** | MUST | O sistema deve permitir que usuário avalie sugestão (👍 útil / 👎 não útil) - dados para melhoria |
| **FR25** | MUST | O sistema deve exibir mensagem de erro amigável se geração falhar |
| **FR26** | SHOULD | O sistema deve mostrar créditos/limite de uso de IA disponíveis |
| **FR27** | COULD | O sistema deve salvar sugestões aceitas em histórico do usuário |
| **FR28** | WON'T | Personalização de prompts base por usuário |
| **FR29** | WON'T | Sugestões de IA para campos adicionais além dos 3 MVP |

**Regras de Negócio:**
- RN8: Prompt do usuário tem limite de 500 caracteres
- RN9: Timeout de geração: 15 segundos (erro se exceder)
- RN10: Máximo 20 sugestões de IA por cenário para prevenir abuso
- RN11: Sugestões não são salvas automaticamente, requerem ação do usuário

---

### ✅ Módulo de Checklists de Debriefing

| ID | Prioridade | Requisito |
|----|-----------|-----------|
| **FR30** | MUST | O sistema deve permitir criar checklist de debriefing com:<br>• Título (obrigatório)<br>• Seções (opcional, ex: "Aspectos Técnicos", "Comunicação")<br>• Itens dentro de cada seção (texto livre, checkbox) |
| **FR31** | MUST | O sistema deve permitir CRUD completo de checklists de debriefing |
| **FR32** | MUST | O sistema deve exibir lista de checklists de debriefing com busca por título |
| **FR33** | MUST | Durante criação/edição de cenário, deve ser possível:<br>• Associar 1 checklist de debriefing existente OU<br>• Criar novo checklist no momento |
| **FR34** | MUST | Na visualização do cenário, o checklist associado deve ser exibido de forma expandida |
| **FR35** | SHOULD | O sistema deve permitir exportar checklist para PDF |
| **FR36** | COULD | O sistema deve permitir marcar itens como concluídos durante uso (modo apresentação) |

**Regras de Negócio:**
- RN12: Checklist pode existir independente de cenário (reutilizável)
- RN13: Relação 1:1 entre cenário e checklist de debriefing
- RN14: Exclusão de checklist associado requer confirmação (aviso)

---

### 📦 Módulo de Checklists de Materiais

| ID | Prioridade | Requisito |
|----|-----------|-----------|
| **FR37** | MUST | O sistema deve permitir criar checklist de materiais com:<br>• Título (obrigatório)<br>• Seções (opcional, ex: "Medicamentos", "Equipamentos", "Impressos")<br>• Itens com: nome, quantidade, checkbox de verificação |
| **FR38** | MUST | O sistema deve permitir CRUD completo de checklists de materiais |
| **FR39** | MUST | O sistema deve exibir lista de checklists de materiais com busca por título |
| **FR40** | MUST | Durante criação/edição de cenário, deve ser possível:<br>• Associar 1 checklist de materiais existente OU<br>• Criar novo checklist no momento |
| **FR41** | MUST | Na visualização do cenário, o checklist de materiais associado deve ser exibido de forma destacada |
| **FR42** | SHOULD | O sistema deve permitir imprimir checklist de materiais para preparação física |
| **FR43** | COULD | O sistema deve permitir marcar itens como "preparado" com timestamp |
| **FR44** | WON'T | Integração com sistema de inventário/estoque |

**Regras de Negócio:**
- RN15: Checklist pode existir independente de cenário (reutilizável)
- RN16: Relação 1:1 entre cenário e checklist de materiais
- RN17: Campo quantidade aceita números e texto (ex: "2 ampolas" ou "a critério")

---

## 🎨 Requisitos Não Funcionais

### Usabilidade (NFR1-NFR5)

| ID | Categoria | Requisito | Métrica/Critério |
|----|-----------|-----------|------------------|
| **NFR1** | Idioma | Interface 100% em Português do Brasil | Todos os textos, mensagens, labels |
| **NFR2** | Intuitividade | Sistema deve ser utilizável sem treinamento formal por usuários com conhecimento básico de web | SUS (System Usability Scale) ≥ 70 |
| **NFR3** | Feedback | Sistema deve fornecer feedback visual imediato para todas as ações (<200ms) | Loading states, confirmações, erros |
| **NFR4** | Acessibilidade | Interface deve seguir WCAG 2.1 nível AA mínimo | Contraste, navegação por teclado, screen reader |
| **NFR5** | Mobile | Interface deve ser responsiva para tablets (iPad), desktop-first | Resolução mínima: 1024px |

---

### Performance (NFR6-NFR10)

| ID | Categoria | Requisito | Métrica/Critério |
|----|-----------|-----------|------------------|
| **NFR6** | Tempo de Carregamento | Páginas principais devem carregar em <3s | P95 em conexão 3G simulada |
| **NFR7** | Tempo de IA | Geração de sugestão por IA em <10s | P90, timeout em 15s |
| **NFR8** | Busca | Resultados de busca retornados em <1s | Até 1000 cenários no banco |
| **NFR9** | Salvamento | Auto-save deve ser imperceptível ao usuário | Background, sem bloquear UI |
| **NFR10** | Escalabilidade | Sistema deve suportar 100 usuários simultâneos sem degradação | Testes de carga |

---

### Segurança (NFR11-NFR16)

| ID | Categoria | Requisito | Métrica/Critério |
|----|-----------|-----------|------------------|
| **NFR11** | Autenticação | Senhas devem ser hasheadas com bcrypt (salt rounds ≥10) | Nunca em plain text |
| **NFR12** | Autorização | Todos os endpoints devem validar permissões no backend | Testes de penetração |
| **NFR13** | HTTPS | Toda comunicação deve ser criptografada com TLS 1.2+ | Sem exceções |
| **NFR14** | Sessões | Tokens JWT com expiração de 30 dias, refresh automático | httpOnly, secure flags |
| **NFR15** | API de IA | Chaves de API armazenadas em variáveis de ambiente, nunca no código | Rotação periódica |
| **NFR16** | LGPD | Dados pessoais com consentimento explícito, direito a exclusão | Compliance checklist |

---

### Confiabilidade (NFR17-NFR20)

| ID | Categoria | Requisito | Métrica/Critério |
|----|-----------|-----------|------------------|
| **NFR17** | Disponibilidade | Uptime de 99% (excluindo janelas de manutenção) | ~7h downtime/mês |
| **NFR18** | Backup | Backup automático diário do banco de dados | Retenção: 30 dias |
| **NFR19** | Recuperação | Recovery Point Objective (RPO): 24h | Perda máxima de dados |
| **NFR20** | Persistência | Dados não salvos devem gerar warning antes de sair da página | Prevenção de perda |

---

### Manutenibilidade (NFR21-NFR24)

| ID | Categoria | Requisito | Métrica/Critério |
|----|-----------|-----------|------------------|
| **NFR21** | Código | Código deve seguir style guide definido (ESLint + Prettier) | CI/CD com linters |
| **NFR22** | Testes | Cobertura de testes unitários ≥60% em lógica crítica | Backend + Frontend |
| **NFR23** | Documentação | README atualizado com setup, API docs gerada automaticamente | Swagger/OpenAPI |
| **NFR24** | Logs | Logs estruturados (JSON) com níveis apropriados (info, warn, error) | Observabilidade |

---

### IA - Qualidade e Custo (NFR25-NFR28)

| ID | Categoria | Requisito | Métrica/Critério |
|----|-----------|-----------|------------------|
| **NFR25** | Relevância | Sugestões de IA devem ser avaliadas como úteis (👍) em ≥70% dos casos | Feedback dos usuários |
| **NFR26** | Precisão Médica | Conteúdo gerado deve ser factualmente correto para contexto de simulação | Revisão por SME |
| **NFR27** | Custo | Custo médio por sugestão de IA <$0,10 USD | Monitoramento em dashboard |
| **NFR28** | Rate Limiting | Sistema deve limitar uso abusivo de IA por usuário | 20 sugestões/cenário |

---

## 🗺️ Épicos e Histórias de Usuário

### Épico 1: Fundação - Autenticação e Infraestrutura
**Descrição:** Estabelecer a base do sistema com autenticação segura e estrutura inicial.  
**Valor de Negócio:** Sem autenticação, nenhuma outra feature é utilizável.  
**Esforço Estimado:** 2 semanas

#### História 1.1: Cadastro de Usuário
**Como** um novo usuário (educador ou gestor),  
**Eu quero** criar uma conta no SimLab Manager,  
**Para que** eu possa começar a usar a plataforma.

**Critérios de Aceite:**
1. Página de cadastro acessível via `/signup`
2. Formulário com campos: Nome Completo, E-mail, Senha, Confirmar Senha
3. Validações frontend:
   - Nome: mínimo 3 caracteres
   - E-mail: formato válido
   - Senha: mínimo 8 caracteres, 1 maiúscula, 1 número, 1 especial
   - Senhas devem coincidir
4. Mensagens de erro inline para cada campo
5. Botão "Criar Conta" desabilitado se form inválido
6. Ao submeter com sucesso, redirecionar para dashboard com sessão ativa
7. Exibir erro se e-mail já existir: "Este e-mail já está cadastrado"
8. Primeiro usuário cadastrado é automaticamente Admin

#### História 1.2: Login de Usuário
**Como** um usuário cadastrado,  
**Eu quero** fazer login no sistema,  
**Para que** eu possa acessar meus cenários e funcionalidades.

**Critérios de Aceite:**
1. Página de login acessível via `/login`
2. Formulário com E-mail e Senha
3. Link "Esqueci minha senha" (mesmo que funcionalidade seja v2)
4. Checkbox "Manter-me conectado" (30 dias vs sessão)
5. Validar credenciais no backend
6. Gerar JWT token com expiração apropriada
7. Redirecionar para dashboard se sucesso
8. Exibir erro genérico se falhar: "E-mail ou senha incorretos"
9. Bloquear após 5 tentativas falhas por 15min (prevenção brute force)

#### História 1.3: Gerenciamento de Permissões
**Como** um administrador,  
**Eu quero** gerenciar permissões de usuários,  
**Para que** eu possa controlar quem tem acesso administrativo.

**Critérios de Aceite:**
1. Menu "Usuários" visível apenas para Admins
2. Lista de todos os usuários com: Nome, E-mail, Perfil, Data Cadastro
3. Ação: Promover para Admin / Rebaixar para Facilitador
4. Confirmação antes de alterar perfil
5. Admin não pode rebaixar a si mesmo se for o único admin
6. Log de alterações de permissão no backend

---

### Épico 2: Core - Gerenciamento de Cenários
**Descrição:** CRUD completo de cenários com formulário estruturado.  
**Valor de Negócio:** Feature principal do produto, resolve o problema central.  
**Esforço Estimado:** 5 semanas

#### História 2.1: Criar Novo Cenário - Estrutura Base
**Como** um facilitador,  
**Eu quero** criar um novo cenário de simulação,  
**Para que** eu possa documentar e reutilizar meus casos clínicos.

**Critérios de Aceite:**
1. Botão "➕ Novo Cenário" no dashboard
2. Formulário dividido em 7 abas conforme FR8:
   - Identificação do Programa
   - Identificação do Cenário
   - Descrição e Início
   - Perfil do Paciente
   - Frames do Cenário
   - Direcionamento e Preparo
   - Debriefing
3. Navegação entre abas com indicador de progresso
4. Campos obrigatórios marcados com *
5. Botões de ação:
   - "Salvar Rascunho" (qualquer etapa)
   - "Publicar" (validação de campos obrigatórios)
   - "Cancelar" (confirmar se há dados)
6. Auto-save a cada 60s em background
7. Validação antes de publicar: Nome, 1 Objetivo, Perfil básico, 1 Frame

#### História 2.2: Frames do Cenário (Etapas Dinâmicas)
**Como** um facilitador,  
**Eu quero** definir os frames do cenário com parâmetros clínicos,  
**Para que** eu possa especificar a progressão fisiológica do caso.

**Critérios de Aceite:**
1. Interface de tabela dinâmica na aba "Frames"
2. Mínimo 3 frames, máximo 10 frames
3. Cada frame contém:
   - Nome da Etapa (ex: "Inicial", "Após intervenção")
   - Parâmetros: FC, SatO2, PA (sistólica/diastólica), FR, Temp
   - Campo "Outros Parâmetros" (texto livre)
   - Informações para Simulador/Operador (textarea)
   - Informações para Facilitador (textarea)
   - Observações
4. Botões "➕ Adicionar Frame" e "🗑️ Remover Frame"
5. Reordenação de frames via drag-and-drop
6. Validação: ao menos 1 frame com parâmetros preenchidos

#### História 2.3: Visualizar e Editar Cenário
**Como** um facilitador,  
**Eu quero** visualizar os detalhes completos de um cenário,  
**Para que** eu possa revisar ou editar antes de usar na simulação.

**Critérios de Aceite:**
1. Lista de cenários mostra card com: Nome, Status, Autor, Data
2. Clicar no card abre visualização em modo leitura
3. Layout organizado por seções colapsáveis
4. Botões de ação:
   - "✏️ Editar" (se for autor ou admin)
   - "📄 Exportar PDF"
   - "📋 Duplicar"
   - "🗑️ Excluir" (confirmação)
5. Modo edição: volta para formulário com dados preenchidos
6. Checklists associados exibidos ao final

#### História 2.4: Busca e Filtros
**Como** um facilitador,  
**Eu quero** buscar cenários por nome ou palavras-chave,  
**Para que** eu possa encontrar rapidamente o que preciso.

**Critérios de Aceite:**
1. Barra de busca no topo da lista de cenários
2. Busca em tempo real (debounce 300ms)
3. Pesquisa em: Nome, Palavras-chave, Nome do Autor
4. Filtros dropdown:
   - "Meus cenários" / "Todos os cenários"
   - Status: "Rascunho" / "Publicado" / "Todos"
5. Ordenação: Data (mais recente), Data (mais antigo), Nome (A-Z)
6. Paginação: 20 itens por página
7. Contador de resultados: "Mostrando X de Y cenários"

---

### Épico 3: Checklists - Debriefing e Materiais
**Descrição:** Gerenciar checklists reutilizáveis e associá-los a cenários.  
**Valor de Negócio:** Reduz erros operacionais, padroniza preparação.  
**Esforço Estimado:** 2 semanas

#### História 3.1: CRUD de Checklist de Debriefing
**Como** um facilitador,  
**Eu quero** criar e gerenciar checklists de debriefing,  
**Para que** eu possa reutilizá-los em diferentes cenários.

**Critérios de Aceite:**
1. Menu "Checklists" com sub-menus: "Debriefing" e "Materiais"
2. Botão "➕ Novo Checklist de Debriefing"
3. Formulário com:
   - Título (obrigatório)
   - Seções (adicionar/remover, ex: "Aspectos Técnicos")
   - Itens em cada seção (texto + checkbox)
4. Interface de arrastar e soltar para reordenar itens
5. Botão "Salvar Checklist"
6. Lista de checklists com busca por título
7. Ações: Visualizar, Editar, Duplicar, Excluir

#### História 3.2: CRUD de Checklist de Materiais
**Como** um técnico,  
**Eu quero** criar checklists de materiais para as simulações,  
**Para que** eu possa garantir que nada seja esquecido na preparação.

**Critérios de Aceite:**
1. Estrutura similar ao checklist de debriefing
2. Itens incluem:
   - Nome do item/material
   - Quantidade (numérico ou texto)
   - Checkbox de verificação
3. Seções para organizar (ex: "Medicamentos", "Equipamentos")
4. Opção de "Imprimir para Preparação" (layout otimizado)

#### História 3.3: Associar Checklists a Cenários
**Como** um facilitador,  
**Eu quero** associar checklists existentes ao meu cenário,  
**Para que** tudo necessário esteja documentado em um só lugar.

**Critérios de Aceite:**
1. No formulário de cenário, seção "Checklists Associados"
2. Dropdown para selecionar checklist de debriefing existente
3. Dropdown para selecionar checklist de materiais existente
4. Opção "➕ Criar novo checklist agora" (abre modal)
5. Preview do checklist selecionado
6. Botão para desvincular
7. Na visualização do cenário, checklists aparecem destacados

---

### Épico 4: IA - Assistência Contextual (MVP)
**Descrição:** Integrar IA generativa para sugerir conteúdo em campos específicos.  
**Valor de Negócio:** Diferencial competitivo, acelera criação, melhora qualidade.  
**Esforço Estimado:** 3 semanas

#### História 4.1: UI de Sugestão de IA
**Como** um facilitador,  
**Eu quero** ter um botão de IA nos campos que suportam sugestões,  
**Para que** eu saiba onde posso obter ajuda automatizada.

**Critérios de Aceite:**
1. Botão "✨ Sugerir com IA" ao lado dos campos:
   - Objetivos de Aprendizagem (Técnicos e Não Técnicos)
   - Histórico Médico / Perfil do Paciente
   - Pontos Norteadores para Debriefing
2. Botão com ícone de estrela/IA reconhecível
3. Tooltip explicativo ao passar mouse: "Obtenha sugestões inteligentes com IA"
4. Badge "BETA" no botão durante MVP
5. Botão desabilitado se atingir limite de uso (20/cenário)

#### História 4.2: Modal de Geração de Sugestão
**Como** um facilitador,  
**Eu quero** inserir um prompt livre e ver a sugestão da IA,  
**Para que** eu possa usar/adaptar o conteúdo gerado no meu cenário.

**Critérios de Aceite:**
1. Clicar "Sugerir com IA" abre modal fullscreen
2. Modal contém:
   - Título: "Sugestão de IA: [Nome do Campo]"
   - Campo textarea para prompt (placeholder com exemplo)
   - Contador de caracteres (máx 500)
   - Botão "Gerar Sugestão"
   - Área de resultado (vazia inicialmente)
3. Ao gerar:
   - Loading spinner com texto "Gerando sugestão..."
   - Timeout visual em 15s (erro se exceder)
4. Resultado exibido com:
   - Texto da sugestão (formatado)
   - Botões: "Copiar", "Inserir no Campo", "Anexar ao Campo", "Nova Sugestão"
   - Avaliação: 👍 Útil / 👎 Não Útil
5. Botão "Fechar" fecha modal sem aplicar

#### História 4.3: Backend - Endpoint de IA
**Como** um desenvolvedor,  
**Eu quero** criar endpoint que integre com API de IA externa,  
**Para que** o frontend possa obter sugestões contextuais.

**Critérios de Aceite:**
1. Endpoint `POST /api/ai/suggest` criado
2. Autenticação JWT obrigatória
3. Body aceita:
   ```json
   {
     "campo": "objetivos_tecnicos",
     "prompt_usuario": "Objetivos para cenário de PCR",
     "contexto": {
       "nome_cenario": "Parada Cardiorrespiratória em AESP",
       "publico_alvo": "Residentes de Medicina"
     }
   }
   ```
4. Backend constrói prompt engenheirado:
   - Contexto do sistema (especialista em simulação)
   - Contexto do cenário
   - Prompt do usuário
   - Instruções de formato de resposta
5. Chamada à API de IA (ex: OpenAI GPT-4, Gemini)
6. Parse da resposta e extração do texto
7. Retorno JSON:
   ```json
   {
     "sugestao": "texto gerado pela IA",
     "tokens_usados": 350,
     "tempo_ms": 2400
   }
   ```
8. Tratamento de erros (timeout, rate limit, erro API)
9. Log estruturado de cada chamada para analytics
10. Rate limiting: 20 chamadas por cenário (validar no backend)

#### História 4.4: Monitoramento de Uso e Custo de IA
**Como** um administrador,  
**Eu quero** visualizar métricas de uso da IA,  
**Para que** eu possa controlar custos e qualidade das sugestões.

**Critérios de Aceite:**
1. Dashboard admin com métricas (v1 simples):
   - Total de sugestões geradas (período)
   - Custo estimado acumulado
   - Taxa de aprovação (👍 / total)
   - Tempo médio de geração
2. Tabela de logs recentes:
   - Data/hora, Usuário, Campo, Tokens, Avaliação
3. Exportar logs para CSV
4. Alertas se custo ultrapassar threshold configurável

---

## 🏛️ Arquitetura e Tecnologia

### Suposições Técnicas (para Arquiteto)

**Stack Recomendada:**
- **Frontend:** React 18+ com TypeScript, Vite, TailwindCSS, shadcn/ui
- **Backend:** Node.js 20+ com Express/Fastify, TypeScript
- **Banco de Dados:** PostgreSQL 15+ (relacional para structured data)
- **IA:** OpenAI API (GPT-4o-mini) ou Google Gemini API
- **Autenticação:** JWT com bcrypt
- **Deploy:** Vercel (frontend) + Railway/Render (backend) ou Monorepo na Vercel
- **Storage:** Supabase Storage ou AWS S3 (para futuro upload de assets)

**Estrutura Sugerida:**
```
simlab-manager/
├── apps/
│   ├── web/          # Frontend React
│   └── api/          # Backend Node.js
├── packages/
│   ├── types/        # TypeScript types compartilhados
│   ├── ui/           # Componentes React compartilhados
│   └── config/       # Configurações ESLint, Prettier
└── docs/
    ├── prd.md
    ├── architecture.md
    └── ui-spec.md
```

**Integrações Externas:**
- OpenAI API ou Google Gemini API (IA generativa)
- SendGrid ou similar (futuro: recuperação de senha por e-mail)

**Considerações de Segurança:**
- Nunca expor chaves de API no frontend
- Rate limiting em todos os endpoints públicos
- Sanitização de inputs (prevenir XSS, SQL Injection)
- CORS configurado apropriadamente
- Helmet.js para headers de segurança

---

## 🚧 Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| **Custo de API de IA excede orçamento** | Média | Alto | • Implementar rate limiting rigoroso<br>• Monitoramento de custo em tempo real<br>• Fallback para prompt sem IA se orçamento esgotado<br>• Cache de sugestões similares |
| **Qualidade das sugestões de IA abaixo do esperado** | Média | Alto | • Iteração no prompt engineering<br>• Testes com usuários reais no beta<br>• Permitir avaliação (👍/👎) para refinamento<br>• Não bloquear criação manual |
| **Adoção baixa pelos educadores** | Média | Alto | • Onboarding simplificado<br>• Demo em instituições piloto<br>• Documentação e tutoriais em vídeo<br>• Migração de conteúdo existente |
| **Performance da IA lenta (>15s)** | Baixa | Médio | • Escolher modelo otimizado (gpt-4o-mini)<br>• Streaming de resposta se possível<br>• Timeout gracioso com mensagem clara |
| **Complexidade do formulário afasta usuários** | Média | Médio | • Progressive disclosure (abas)<br>• Campos opcionais vs obrigatórios claros<br>• Auto-save para prevenir perda<br>• Modo "Quick Start" com mínimo de campos |
| **Dados de cenários sensíveis/confidenciais** | Baixa | Alto | • LGPD compliance desde o início<br>• Opção de "Cenário Privado" (não compartilhado)<br>• Termos de uso claros sobre dados e IA |

---

## 📊 Métricas de Validação do MVP

### Critérios de Sucesso (3 meses pós-launch)

**Adoção:**
- ✅ ≥50 usuários cadastrados
- ✅ ≥30 usuários ativos mensais (MAU)
- ✅ ≥100 cenários criados

**Engajamento:**
- ✅ ≥60% dos cenários usam sugestão de IA ao menos 1x
- ✅ Taxa de conclusão de cenários (publicados/iniciados) ≥70%
- ✅ Tempo médio de criação ≤60min (vs baseline de 180-300min)

**Qualidade:**
- ✅ NPS ≥40
- ✅ Taxa de aprovação de sugestões de IA (👍) ≥70%
- ✅ <5 bugs críticos reportados

**Performance:**
- ✅ Uptime ≥99%
- ✅ P95 de tempo de geração de IA <8s
- ✅ Custo de IA por cenário <$0,50

---

## 📅 Roadmap Futuro (Pós-MVP)

### Versão 2.0 (Q1 2026)
- [ ] Templates pré-configurados de cenários (ex: PCR, IAM, Sepse)
- [ ] Colaboração em tempo real (múltiplos editores)
- [ ] Sistema de reviews e aprovações (workflow)
- [ ] Biblioteca de recursos (imagens, vídeos, documentos)
- [ ] Recuperação de senha por e-mail

### Versão 3.0 (Q2 2026)
- [ ] Versionamento e histórico de alterações
- [ ] Analytics avançados e dashboards para gestores
- [ ] Integração com sistemas de agendamento (Google Calendar)
- [ ] App mobile (React Native)
- [ ] Compartilhamento público de cenários (marketplace)

### Long-term (2026+)
- [ ] API pública para integrações
- [ ] Fine-tuning de modelo de IA customizado para simulação
- [ ] Sugestões de IA expandidas para mais campos
- [ ] Sistema de gamificação (badges, rankings)
- [ ] Multi-idioma (Inglês, Espanhol)

---

## 🎬 Próximos Passos

### Para UX Expert (Sally)
> "Sally, o PRD está aprovado! Por favor, crie a **Especificação UI/UX** detalhada (`front-end-spec-tmpl.yaml`). Priorize:
> 1. Arquitetura da informação do formulário de cenário (7 seções)
> 2. Fluxo de usuário completo (cadastro → criação → uso de IA)
> 3. Wireframes de alta fidelidade para telas principais
> 4. Sistema de design (cores, tipografia, componentes)
> 5. Interações e micro-animações (especialmente no modal de IA)
> Use as personas e metas de UI/UX do PRD como guia."

### Para Arquiteto (Winston)
> "Winston, o PRD está aprovado! Por favor, crie o **Documento de Arquitetura Fullstack** (`fullstack-architecture-tmpl.yaml`). Priorize:
> 1. Validação e refinamento da stack tecnológica proposta
> 2. Schema completo do banco de dados PostgreSQL
> 3. Design da API REST (endpoints, payloads, autenticação)
> 4. Arquitetura de componentes frontend (páginas, hooks, state management)
> 5. Estratégia de integração com API de IA (prompt engineering, rate limiting)
> 6. Pipeline CI/CD e estratégia de deploy
> 7. Monitoramento e observabilidade
> Use as suposições técnicas e requisitos não-funcionais do PRD como baseline."

---

## 📄 Anexos

### Change Log

| Data | Versão | Descrição | Autor |
|------|--------|-----------|-------|
| 22/10/2025 | 0.1 | Rascunho Inicial | John (PM AI) |
| 22/10/2025 | 1.0 | **Versão Otimizada**<br>• Adicionadas métricas quantificáveis<br>• Requisitos priorizados com MoSCoW<br>• NFRs expandidos com critérios mensuráveis<br>• Personas detalhadas<br>• Riscos e mitigações<br>• Roadmap futuro<br>• Critérios de validação do MVP<br>• Limpeza de artefatos de citação | Claude (Consultor) |

### Referências
- [Roteiro de Criação de Cenário.pdf] - Documento base para estrutura de cenários
- [pm-checklist.md] - Checklist de validação de PRD
- INACSL Standards of Best Practice - Guidelines para simulação em saúde

---

**Documento aprovado para prosseguir com Design UI/UX e Arquitetura Fullstack.**
