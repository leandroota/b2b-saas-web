# Plataforma de Trabalho Unificado (B2B SaaS)
**Product Requirements Document (PRD) & Contexto Geral**

## 1. Framing Estruturado

### Problema
Hoje o trabalho fica fragmentado entre múltiplas ferramentas: uma para tarefas, outra para chat, outra para documentação, outra para atualização de status. Isso gera perda de contexto, retrabalho, desalinhamento e baixa retenção de conhecimento.

### Objetivo
Criar uma plataforma SaaS B2B de trabalho unificado que centralize:
- Gestão de projetos e tarefas
- Comunicação em tempo real
- Atualização assíncrona e colaboração social
- Wiki viva de projetos
- Inteligência contextual via Copilot

### Aposta
Se times puderem executar, conversar, registrar decisões, compartilhar aprendizados e consultar contexto no mesmo ambiente, então haverá:
- Menos troca entre ferramentas
- Mais continuidade operacional
- Melhor visibilidade de avanço
- Maior reaproveitamento de conhecimento
- Mais engajamento útil

### Riscos
- Escopo amplo demais para MVP.
- Sobreposição de papéis entre chat, feed, tarefa e wiki.
- Feed virar ruído social.
- Copilot virar gimmick em vez de utilidade real.
- Complexidade excessiva de navegação e views por metodologia.

### Assunções
- O produto inicial será web responsivo.
- O público inicial são times multifuncionais em empresas médias, com gestores, líderes e colaboradores.
- O MVP prioriza centralização e contexto, não profundidade máxima em cada módulo.
- O lançamento inicial não inclui integrações externas profundas.
- O Copilot inicial será assistivo, não autônomo.

---

## 2. PRD — Plataforma de Trabalho Unificado com Colaboração Social, Wiki e Copilot

### 2.1 Contexto
- **Produto/área:** SaaS B2B de work management, collaboration e knowledge management.
- **Problema atual:** Usuários alternam entre ferramentas; conhecimento se perde; gestores têm dificuldade em acompanhar avanço; ferramentas tradicionais não sustentam colaboração contínua.
- **Evidência:** Necessidade explícita de centralizar chat, tarefas, atualizações, wiki e dashboard e suportar múltiplos contextos.
- **Restrições:** MVP focado no fluxo principal, evitando escopo enterprise profundo; IA não é 100% autônoma.

### 2.2 Objetivo
- **Do Usuário:** Tocar projetos, conversar, acompanhar status e registrar conhecimento num só lugar.
- **Do Negócio:** Criar uma plataforma central, aumentando adoção recorrente, colaboração e visibilidade gerencial.
- **Métrica Principal (North Star):** % de projetos ativos semanalmente com uso combinado de execução + comunicação + conhecimento.

### 2.3 Usuários, Papéis e Cenários
- **Perfis:** Colaborador individual, Líder de projeto / PM / PO, Gerente / Head, Admin básico.
- **Permissões:** Baseado em contexto (visualizar, editar, configurar metodologia e gerenciar membros dependendo do perfil).
- **Cenários Principais:** 
  1. Usuário na Home atualizando-se e navegando.
  2. Líder criando projeto com metodologias.
  3. Transformação de conversa em aprendizado/wiki guiado pelo Copilot.

### 2.4 Escopo do MVP
- **Home:** Timeline e filtros.
- **Spaces & Projetos:** Organização com metodologia configurável.
- **Views de Projeto:** Lista, kanban, backlog, sprint, timeline, atividade, wiki.
- **Chat:** Tempo real por projeto/grupo.
- **Feed (Social):** Posts, comentários, favoritos, aprendizados.
- **Wiki:** Overview, decisões, QA, funcional/técnico.
- **Dashboard:** Visão gerencial (status, avanço, gargalos).
- **Copilot:** Resumos de threads, extração de tasks e rascunhos de wiki/updates.

### 2.5 Não-Escopo (MVP)
Videochamadas, integrações profundas, capacity planning financeiro, permissões enterprise granulares, agentes de publicação automática sem revisão.

### 2.6 Regras de Negócio e Limites
*Ver detalhes no arquivo completo no projeto se aplicável ou consultar a especificação original.* (Ex: Limite de strings, coerências estruturais entre metodologias).

---

## 3. UI Spec (Módulos Principais)

### Home
- **Objetivo:** Hub diário do usuário.
- **Estrutura:** Header, Sidebar global, Timeline central, Contexto lateral (Spaces).
- **Responsividade:** 3 colunas (Desktop) -> 1 coluna (Mobile).
- **Tracking:** `home_viewed`, `timeline_filter_selected`.

### Projeto (Agile/Kanban/Plan)
- **Objetivo:** Concentrar execução, atividade, wiki e contexto.
- **Estrutura:** Header de projeto, Tabs reativas à metodologia, View principal, Painel Copilot.
- **Tracking:** `project_viewed`, `project_tab_selected`.

### Chat Contextual
- **Objetivo:** Comunicação rápida sem sair do domínio.
- **Estrutura:** Lista de canais, histórico, composer, e assistente Copilot acoplado à thread.

### Wiki do Projeto
- **Objetivo:** Memória viva documentada.
- **Estrutura:** Navegação de páginas, editor rico, histórico.

### Copilot Contextual
- **Objetivo:** Reduzir esforço de curadoria e organização operacional.
- **Estrutura:** Drawer lateral, seleção de intenção, aprovação humana final (estado).

---

## 4. QA UX/UI (Issues Detectadas no Framing)

- **[S1] Papéis ambíguos:** Necessidade de reforçar onboarding sobre a diferença de Chat, Feed e Wiki.
- **[S1] Excesso de navegação:** Uso de Progressive Disclosure e abas dinâmicas.
- **[S2] Ruído no Feed social:** Foco em curadoria útil (Updates formatais, Aprendizados).
- **[S2] Confiança no Copilot:** Nunca publicar sozinho. Sempre agir em modo "Rascunho / Sugestão".
- **[S2] Dados Parciais no Dashboard:** Avisar quando métricas não refletem a totalidade.

---

## 5. Tracking Plan (Eventos Core)

- `home_viewed`
- `timeline_filter_selected`
- `project_created` (com `methodology` e role)
- `project_viewed`
- `project_tab_selected`
- `message_sent` (com `context_type` e `context_id`)
- `post_created`
- `post_saved_as_learning`
- `wiki_page_created`
- `task_status_changed`
- `copilot_opened` / `copilot_output_applied`
- `error_shown`
