# Backlog de Discovery / Delivery

Este documento detalha o mapa de execução do produto com esforço relativo, dependências e a sequencia de trilhas sugerida para as squads.

## Mapa da Iniciativa

| Iniciativa | Épico | ID | User Story | Prio | Dependências | Esforço | Release |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **Fundação** | 01. Workspace e navegação | US-001 | Acessar a Home após login | P0 | Autenticação, shell global | M | R1 |
| **Fundação** | 01. Workspace e navegação | US-002 | Navegar pelos módulos principais | P0 | Layout global, roteamento | M | R1 |
| **Fundação** | 01. Workspace e navegação | US-003 | Alternar entre Spaces | P0 | Modelagem de Space, permissões | M | R1 |
| **Projetos** | 02. Gestão de metodologias | US-004 | Criar projeto | P0 | Projeto, formulário, permissões | M | R1 |
| **Projetos** | 02. Gestão de metodologias | US-005 | Definir metodologia ao criar projeto | P0 | US-004, regras de metodologia | M | R1 |
| **Projetos** | 02. Gestão de metodologias | US-006 | Abrir visão geral do projeto | P0 | US-004, US-005, header do projeto | M | R1 |
| **Execução** | 03. Execução de trabalho | US-007 | Visualizar projeto em Lista | P0 | Projeto, entidade tarefa | M | R1 |
| **Execução** | 03. Execução de trabalho | US-008 | Visualizar projeto em Kanban | P0 | US-007, status de tarefa | M | R1 |
| **Execução** | 03. Execução de trabalho | US-009 | Criar e editar item de trabalho | P0 | US-007, persistência, formulário | M | R1 |
| **Execução** | 03. Execução de trabalho | US-010 | Atualizar status do item | P0 | US-009, regras de status | S | R1 |
| **Comunicação** | 04. Chat em tempo real | US-011 | Acessar chat contextual do projeto | P0 | Projeto, permissões, chat | M | R1 |
| **Comunicação** | 04. Chat em tempo real | US-012 | Enviar mensagem no chat | P0 | US-011, realtime/persistência | M | R1 |
| **Comunicação** | 04. Chat em tempo real | US-013 | Acessar conversas diretas e de grupo | P0 | US-012, tipagem de contexto | M | R1 |
| **Social** | 05. Feed social e atividade | US-014 | Ver timeline na Home | P1 | Home, posts, permissões | M | R2 |
| **Social** | 05. Feed social e atividade | US-015 | Filtrar timeline | P1 | US-014 | S | R2 |
| **Social** | 05. Feed social e atividade | US-016 | Criar publicação contextual | P1 | US-014, formulário de post | M | R2 |
| **Social** | 05. Feed social e atividade | US-017 | Interagir com publicação | P1 | US-016 | S | R2 |
| **Memória** | 06. Wiki e memória do projeto | US-018 | Acessar wiki do projeto | P1 | Projeto, wiki base, permissões | M | R2 |
| **Memória** | 06. Wiki e memória do projeto | US-019 | Criar e editar página da wiki | P1 | US-018, editor, persistência | M | R2 |
| **Memória** | 06. Wiki e memória do projeto | US-020 | Promover aprendizado para wiki | P1 | US-017, US-019 | M | R2 |
| **Visão gerencial**| 07. Dashboard gerencial | US-021 | Ver status resumido dos projetos | P2 | Métricas mínimas, permissões | M | R3 |
| **Visão gerencial**| 07. Dashboard gerencial | US-022 | Identificar gargalos e itens sem progresso | P2 | US-021, modelagem de bloqueio | M | R3 |
| **Visão gerencial**| 07. Dashboard gerencial | US-023 | Acessar projeto a partir do dashboard | P2 | US-021 | S | R3 |
| **IA contextual** | 08. Copilot contextual | US-024 | Resumir projeto com Copilot | P2 | Projeto, Copilot, guardrails | M | R3 |
| **IA contextual** | 08. Copilot contextual | US-025 | Resumir thread do chat | P2 | Chat, Copilot | M | R3 |
| **IA contextual** | 08. Copilot contextual | US-026 | Extrair tarefas de conversa | P2 | US-025, tarefa, confirmação | M | R3 |
| **IA contextual** | 08. Copilot contextual | US-027 | Gerar update com Copilot | P2 | Feed, Copilot | M | R3 |
| **Segurança** | 09. Permissões e segurança | US-028 | Restringir acesso por contexto | P2 | Autorização, contexto | M | R3 |
| **Segurança** | 09. Permissões e segurança | US-029 | Bloquear Copilot fora do escopo permitido | P2 | US-028, guardrails IA | M | R3 |
| **Qualidade** | 10. Qualidade operacional | US-030 | Exibir estados obrigatórios | P2 | Design system, states | M | R3 |
| **Qualidade** | 10. Qualidade operacional | US-031 | Garantir acessibilidade mínima | P2 | Design system, accessibility | M | R3 |
| **Qualidade** | 10. Qualidade operacional | US-032 | Rastrear eventos críticos | P2 | Tracking plan | M | R3 |

*(Esforço: S=Pequeno / M=Médio / L=Grande / XL=Muito grande)*

---

## Sequência Recomendada de Execução (Trilhas)

### 👋 Trilha 1 — Core app
- **Escopo:** US-001 a US-006 (Fundação e setup do projeto)

### 📊 Trilha 2 — Trabalho e execução
- **Escopo:** US-007 a US-010 (Listas, Kanban, Mutação de Tarefas)

### 💬 Trilha 3 — Comunicação
- **Escopo:** US-011 a US-013 (Chat contextual e grupos)

---
*Acima dessa linha = MVP Estrito R1*

### 🧠 Trilha 4 — Social + conhecimento
- **Escopo:** US-014 a US-020 (Feed, Aprendizados e Wiki)

### 🚀 Trilha 5 — Gestão + IA + governança
- **Escopo:** US-021 a US-032 (Dashboard, AI Copilot, Permissões e Qualidade)
