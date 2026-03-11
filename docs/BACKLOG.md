# Backlog Priorizado — MVP e Sequência de Releases

## Critério de Priorização
- **P0** = Sem isso, o produto não funciona como proposta central.
- **P1** = Gera valor importante logo após o núcleo.
- **P2** = Fortalece diferenciação, governança e escala.

---

## P0 — Núcleo do Produto (Release 1 — Plataforma Utilizável)

### Épico 01 — Fundação do workspace e navegação
**US-001 — Acessar a Home após login**
- **Como** usuário **Quero** entrar na plataforma e cair na Home **Para** retomar rapidamente meu contexto de trabalho.
- *Aceite:* Login -> Direcionado para Home -> Visualiza navegação e conteúdo.
- *Metadados:* Risco: Médio | Valor: Alto | Score: 9
- *Dependências:* Autenticação, Shell, Navegação.

**US-002 — Navegar pelos módulos principais**
- **Como** usuário **Quero** acessar Home, Spaces, Projetos, Grupos, Chat, Dashboard e Minhas tarefas **Para** encontrar rapidamente o contexto.
- *Aceite:* Clique em menu -> Abaixo módulo ativo visualmente destacado.
- *Metadados:* Risco: Médio | Valor: Alto | Score: 9

**US-003 — Alternar entre Spaces**
- **Como** usuário **Quero** navegar entre meus Spaces **Para** separar meus contextos.
- *Aceite:* Lista de Spaces reflete permissões -> Abrir Space evidencia seu tipo.
- *Metadados:* Risco: Médio | Valor: Alto | Score: 8

### Épico 02 — Gestão de projetos e metodologias
**US-004 — Criar projeto**
- **Como** líder de projeto **Quero** criar um novo projeto **Para** iniciar uma frente de trabalho.
- *Aceite:* Permissão validada -> Preenche campos -> Projeto listado.
- *Metadados:* Risco: Médio | Valor: Alto | Score: 10

**US-005 — Definir metodologia ao criar projeto**
- **Como** líder **Quero** escolher a metodologia **Para** receber a estrutura inicial.
- *Aceite:* Escolher Ágil/Kanban/Lista -> Projeto nasce com views compatíveis.
- *Metadados:* Risco: Médio | Valor: Alto | Score: 9

**US-006 — Abrir visão geral do projeto**
- **Como** usuário **Quero** acessar a visão geral **Para** entender status e membros.
- *Aceite:* Projeto aberto -> Mostra status, membros e navegação da metodologia.
- *Metadados:* Risco: Baixo | Valor: Alto | Score: 8

### Épico 03 — Execução de trabalho
**US-007 — Visualizar projeto em Lista**
- **Como** usuário **Quero** acompanhar itens em lista **Para** visão objetiva.
- *Aceite:* Acessar view Lista -> Mostra itens e status.
- *Metadados:* Risco: Baixo | Valor: Alto | Score: 8

**US-008 — Visualizar projeto em Kanban**
- **Como** usuário **Quero** acompanhar itens em board **Para** entender fluxo.
- *Aceite:* Acessar Board -> Colunas por status -> Itens alocados.
- *Metadados:* Risco: Médio | Valor: Alto | Score: 9

**US-009 — Criar e editar item de trabalho**
- **Como** usuário **Quero** criar e editar itens **Para** organizar execução.
- *Aceite:* Edição válida -> Persistência de sucesso -> UI atualizada.
- *Metadados:* Risco: Médio | Valor: Alto | Score: 10

**US-010 — Atualizar status do item**
- **Como** usuário **Quero** alterar status **Para** refletir avanço.
- *Aceite:* Altera status -> Mudança persiste -> Atualização na view.
- *Metadados:* Risco: Baixo | Valor: Alto | Score: 9

### Épico 04 — Chat em tempo real
**US-011 — Acessar chat contextual do projeto**
- **Como** usuário **Quero** conversar no contexto do projeto **Para** centralizar alinhamentos.
- *Aceite:* Abrir aba Chat -> Histórico validado -> Contexto explícito.
- *Metadados:* Risco: Médio | Valor: Alto | Score: 9

**US-012 — Enviar mensagem no chat**
- **Como** usuário **Quero** enviar mensagens **Para** comunicar.
- *Aceite:* Enviar mensagem -> Salva com sucesso -> Associada ao projeto.
- *Metadados:* Risco: Médio | Valor: Alto | Score: 10

**US-013 — Acessar conversas diretas e de grupo**
- **Como** usuário **Quero** acessar outras conversas **Para** trocas variadas.
- *Aceite:* Aba Chat global -> Lista clara de grupos/diretas.
- *Metadados:* Risco: Médio | Valor: Médio | Score: 7

---

## P1 — Valor Ampliado e Diferenciação (Release 2 — Camada Social + Memória)

### Épico 05 — Feed social e atividade
- **US-014:** Ver timeline na Home
- **US-015:** Filtrar timeline (Geral vs Projetos que participo)
- **US-016:** Criar publicação contextual
- **US-017:** Interagir com publicação

### Épico 06 — Wiki e memória do projeto
- **US-018:** Acessar wiki do projeto
- **US-019:** Criar e editar página da wiki
- **US-020:** Promover aprendizado para wiki

### Épico 07 — Dashboard gerencial
- **US-021:** Ver status resumido dos projetos
- **US-022:** Identificar gargalos e itens sem progresso
- **US-023:** Acessar projeto a partir do dashboard

---

## P2 — Diferenciação Avançada (Release 3 — Gestão + IA + Governança)

### Épico 08 — Copilot contextual
- **US-024:** Resumir projeto com Copilot
- **US-025:** Resumir thread do chat
- **US-026:** Extrair tarefas de conversa
- **US-027:** Gerar update com Copilot

### Épico 09 — Permissões, visibilidade e segurança
- **US-028:** Restringir acesso por contexto
- **US-029:** Bloquear Copilot fora do escopo

### Épico 10 — Qualidade operacional
- **US-030:** Exibir estados obrigatórios (Loading, Empty, Error)
- **US-031:** Garantir acessibilidade mínima
- **US-032:** Rastrear eventos críticos (Tracking)

---

## Minha Recomendação Pragmática de MVP Estrito:
1. Home Básica
2. Spaces
3. Criação de Projeto e Metodologias (Agile/Kanban/Lista)
4. Kanban e Lista funcionando
5. Chat Contextual
(Isso valida o núcleo operacional sem nos perdermos em complexidade secundária)
