## Épico 4: Assistência de IA Contextual
**Valor:** Diferencial competitivo, acelera a criação de conteúdo e melhora a qualidade das sugestões, aumentando a eficiência.

### História 4.1: UI de Sugestão de IA
Como um facilitador,
Eu quero ter um botão de IA nos campos que suportam sugestões,
Para que eu saiba onde posso obter ajuda automatizada.

**Critérios de Aceite:**
1.  **Dado** que estou no formulário de cenário,
    **Então** vejo um botão "✨ Sugerir com IA" ao lado dos campos de Objetivos de Aprendizagem (Técnicos e Não Técnicos), Histórico Médico / Perfil do Paciente e Pontos Norteadores para Debriefing.
2.  **Dado** que o botão "✨ Sugerir com IA" está visível,
    **Então** ele possui um ícone de estrela/IA reconhecível e um tooltip explicativo "Obtenha sugestões inteligentes com IA" ao passar o mouse.
3.  **Dado** que o botão "✨ Sugerir com IA" está visível,
    **Então** ele exibe um badge "BETA" durante o MVP.
4.  **Dado** que o limite de uso de IA (20/cenário) foi atingido,
    **Então** o botão "✨ Sugerir com IA" é desabilitado.

### História 4.2: Modal de Geração de Sugestão
Como um facilitador,
Eu quero inserir um prompt livre e ver a sugestão da IA,
Para que eu possa usar/adaptar o conteúdo gerado no meu cenário.

**Critérios de Aceite:**
1.  **Dado** que clico em "✨ Sugerir com IA",
    **Então** um modal fullscreen é aberto com o Título "Sugestão de IA: [Nome do Campo]", um campo textarea para prompt livre (com placeholder e contador de caracteres até 500), um botão "Gerar Sugestão" e uma área de resultado inicialmente vazia.
2.  **Dado** que clico em "Gerar Sugestão",
    **Então** um loading spinner com o texto "Gerando sugestão..." é exibido, e um timeout visual de 15s é aplicado (exibindo erro se excedido).
3.  **Dado** que a sugestão é gerada,
    **Então** o resultado é exibido com o texto da sugestão (formatado) e botões para "Copiar", "Inserir no Campo", "Anexar ao Campo", "Nova Sugestão" e "Fechar" (sem aplicar).
4.  **Dado** que uma sugestão é exibida,
    **Então** posso avaliá-la como "👍 útil" ou "👎 não útil".

### História 4.3: Backend - Endpoint de IA
Como um desenvolvedor,
Eu quero criar endpoint que integre com API de IA externa,
Para que o frontend possa obter sugestões contextuais.

**Critérios de Aceite:**
1.  **Dado** que o backend está em execução,
    **Então** existe um endpoint `POST /api/ai/suggest` que requer autenticação JWT.
2.  **Dado** que o endpoint `POST /api/ai/suggest` é chamado com um body contendo `campo`, `prompt_usuario` e `contexto` (nome_cenario, publico_alvo),
    **Então** o backend constrói um prompt engenheirado (contexto do sistema, contexto do cenário, prompt do usuário, instruções de formato de resposta) e chama uma API de IA externa (ex: OpenAI GPT-4, Gemini).
3.  **Dado** que a API de IA retorna uma resposta,
    **Então** o backend parseia a resposta, extrai o texto da sugestão e retorna um JSON com `sugestao`, `tokens_usados` e `tempo_ms`.
4.  **Dado** que ocorre um erro na chamada da API de IA (timeout, rate limit, erro da API),
    **Então** o backend trata o erro e retorna uma mensagem apropriada.
5.  **Dado** que uma chamada à API de IA é realizada,
    **Então** um log estruturado é salvo para analytics e o rate limiting (20 chamadas por cenário) é validado no backend.

### História 4.4: Monitoramento de Uso e Custo de IA
Como um administrador,
Eu quero visualizar métricas de uso da IA,
Para que eu possa controlar custos e qualidade das sugestões.

**Critérios de Aceite:**
1.  **Dado** que sou um Administrador,
    **Quando** acesso o dashboard,
    **Então** vejo métricas de uso da IA (Total de sugestões geradas, Custo estimado acumulado, Taxa de aprovação, Tempo médio de geração) e uma tabela de logs recentes (Data/hora, Usuário, Campo, Tokens, Avaliação).
2.  **Dado** que estou no dashboard de métricas de IA,
    **Então** posso exportar os logs para CSV.
3.  **Dado** que o custo de IA ultrapassa um threshold configurável,
    **Então** o sistema gera alertas para o Administrador.