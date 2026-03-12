# PRD — [NOME_DO_PRODUTO]
> Plataforma SaaS de Gestão Comercial e Financeira
> Versão: 0.1-draft | Status: Em elaboração | Última atualização: 2026-02-22

---

## Índice

1. [Visão Geral & Problema](#1-visão-geral--problema)
2. [Público-alvo & Personas](#2-público-alvo--personas)
3. [Proposta de Valor](#3-proposta-de-valor)
4. [Arquitetura do Sistema](#4-arquitetura-do-sistema)
5. [Modelo de Workspaces & Hierarquia](#5-modelo-de-workspaces--hierarquia)
6. [Sistema de Planos & Billing](#6-sistema-de-planos--billing)
7. [Design System](#7-design-system)
8. [Módulos Funcionais](#8-módulos-funcionais)
9. [Integrações Externas](#9-integrações-externas)
10. [Requisitos Não-Funcionais](#10-requisitos-não-funcionais)
11. [Roadmap](#11-roadmap)
12. [Riscos & Constraints](#12-riscos--constraints)

---

## 1. Visão Geral & Problema

### 1.1 Problema

Freelancers e pequenos empresários brasileiros enfrentam fragmentação extrema nas ferramentas do dia a dia: usam um sistema para CRM, outro para emitir notas fiscais, outro para contratos, outro para acompanhar pagamentos, outro para agenda. Essa fragmentação gera:

- Perda de tempo com contexto switching entre ferramentas
- Dados de clientes desconectados entre sistemas
- Alto custo acumulado de múltiplas assinaturas
- Falta de visibilidade centralizada sobre o negócio
- Retrabalho manual em processos que deveriam ser automatizados

### 1.2 Solução

**[NOME_DO_PRODUTO]** é uma plataforma SaaS centralizada que unifica em um único espaço de trabalho todas as operações comerciais e financeiras: CRM, contratos, emissão de notas fiscais, gestão de checkout, captação de leads, agenda, follow-up e pagamentos.

### 1.3 Visão de Produto

> Ser a ferramenta única que um freelancer ou pequeno empresário precisa para gerenciar todo o ciclo de vendas e operações — da captação do lead à emissão da nota fiscal.

---

## 2. Público-alvo & Personas

### Persona 1 — Freelancer Autônomo

| Campo | Detalhe |
|-------|---------|
| Perfil | Designer, dev, consultor, redator, etc. |
| Tamanho | Solo ou micro-equipe (1–3 pessoas) |
| Dor principal | Gerencia clientes no WhatsApp, contratos no Google Docs, NF manual no site da prefeitura |
| Objetivo | Profissionalizar a operação sem complexidade |
| Uso esperado | 1 workspace, 1–3 usuários, volume baixo de NF |

### Persona 2 — Pequeno Empresário

| Campo | Detalhe |
|-------|---------|
| Perfil | Dono de pequena empresa de serviços ou produtos digitais |
| Tamanho | Time de 2–15 pessoas |
| Dor principal | Falta de visibilidade do funil de vendas, NF descentralizada, follow-up manual |
| Objetivo | Centralizar a operação do time comercial |
| Uso esperado | 1–3 workspaces, múltiplos usuários, volume médio de NF e checkout |

---

## 3. Proposta de Valor

### Para Freelancers
> "Tudo que você precisa para rodar seu negócio em um só lugar — sem planilha, sem papel, sem retrabalho."

### Para Pequenos Empresários
> "Seu time de vendas e operações em sincronia, do primeiro contato com o lead até a nota fiscal emitida."

### Diferenciais Competitivos

| Diferencial | Descrição |
|-------------|-----------|
| Tudo-em-um | CRM + NF + Contratos + Checkout + Leads + Agenda no mesmo lugar |
| Multi-workspace | Usuário pode ter múltiplos negócios na mesma conta |
| Checkout embutido | Assinatura de planos dentro do próprio SaaS (sem redirect) |
| Motor de follow-up | Sequências automáticas baseadas em regras por motivo/canal |
| Captação de leads | Scraping via API própria integrada ao CRM |
| Foco no mercado BR | NF-e + NFS-e, moeda BRL, foco na realidade do autônomo brasileiro |

---

## 4. Arquitetura do Sistema

### 4.1 Stack Técnica

| Camada | Tecnologia | Status |
|--------|-----------|--------|
| Frontend | React 18 + TypeScript + Vite | ✅ Definido |
| Estilização | TailwindCSS + shadcn/ui + Framer Motion | ✅ Definido |
| Backend / BaaS | Supabase | 🟡 Provável |
| Banco de dados | Supabase (PostgreSQL) | 🟡 Provável |
| Autenticação | Supabase Auth | 🟡 Derivado |
| Storage | Supabase Storage (PDFs, contratos) | 🟡 Derivado |
| Edge Functions | Supabase Edge Functions | 🟡 A confirmar |
| API customizada | Node.js / NestJS (se necessário) | ⏳ A decidir |
| Pagamentos SaaS | AbacatePay | 🟡 Provável |
| NF-e / NFS-e | API de terceiro (a definir) | ⏳ A definir |
| Scraping de leads | API própria (já existente) | ✅ Definido |

> **Nota de decisão pendente:** Definir se o backend será Supabase como BaaS completo ou Supabase + camada API própria (Node/NestJS). Impacta complexidade de RLS, Edge Functions e lógica de negócio.

### 4.2 Modelo de Dados — Alto Nível

```
User (conta global)
  └── WorkspaceMember (N:N)
        └── Workspace (espaço de trabalho)
              ├── Subscription (plano ativo)
              ├── Lead
              ├── Contract
              ├── Invoice (NF-e / NFS-e)
              ├── CheckoutRecord
              ├── Appointment
              ├── FollowUpItem
              └── PaymentRecord
```

### 4.3 Autenticação

- Autenticação via **Supabase Auth**
- Suporte a email/senha no v1.0
- OAuth (Google, GitHub) — visual no frontend, integração real no v1.0
- Sessão persistente com refresh token
- Convite de membros via email (link com token)

### 4.4 Multi-tenancy

- Isolamento de dados por `workspace_id` em todas as tabelas
- Row Level Security (RLS) no Supabase garantindo que usuários só acessam dados de workspaces aos quais pertencem
- Um usuário pode ser **dono de múltiplos workspaces** (paga por cada um separadamente)
- Um usuário pode ser **membro/afiliado** de workspaces de outros (convidado pelo dono)

---

## 5. Modelo de Workspaces & Hierarquia

### 5.1 Estrutura de Workspace

```
Workspace
  ├── Dono (Owner)     — cria, paga, tem acesso total, pode deletar
  ├── Admin            — acesso total exceto billing e exclusão do workspace
  └── Membro (Member)  — acesso configurável por módulo
```

### 5.2 Regras de Negócio

| Regra | Detalhe |
|-------|---------|
| Criação | Qualquer usuário autenticado pode criar um workspace |
| Pagamento | Somente o Dono assina/paga pelo plano do workspace |
| Múltiplos workspaces | Usuário pode ser Dono de N workspaces, pagando por cada |
| Afiliação | Usuário pode ser membro de workspaces de outros (via convite) |
| Convite | Dono ou Admin pode convidar por email |
| Limite de membros | Definido pelo plano do workspace |
| Permissões | Admin configura permissões de Membros por módulo |

### 5.3 Permissões por Módulo (v1.0)

| Módulo | Dono | Admin | Membro |
|--------|------|-------|--------|
| CRM | ✅ Total | ✅ Total | 🔧 Configurável |
| Contratos | ✅ Total | ✅ Total | 🔧 Configurável |
| NF-e / NFS-e | ✅ Total | ✅ Total | 🔧 Configurável |
| Checkout | ✅ Total | ✅ Total | 🔧 Configurável |
| Leads | ✅ Total | ✅ Total | 🔧 Configurável |
| Agenda | ✅ Total | ✅ Total | 🔧 Configurável |
| Follow-up | ✅ Total | ✅ Total | 🔧 Configurável |
| Pagamentos | ✅ Total | ✅ Total | 🔧 Configurável |
| Usuários | ✅ Total | ✅ Gerenciar membros | ❌ Bloqueado |
| Billing / Planos | ✅ Total | ❌ Bloqueado | ❌ Bloqueado |

---

## 6. Sistema de Planos & Billing

### 6.1 Modelo de Assinatura

- Assinatura **por workspace** (não por usuário global)
- Dono paga pelo plano do workspace
- Checkout **embutido no próprio SaaS** (sem redirect externo)
- Processador: **AbacatePay** (provável) — a confirmar

### 6.2 Dimensões de Limite (a detalhar futuramente)

| Dimensão | Descrição |
|----------|-----------|
| Usuários por workspace | Número máximo de membros |
| Volume de NF emitidas/mês | Limite de emissões de NF-e/NFS-e |
| Leads captados/mês | Limite de scraping via API |
| Contratos gerados/mês | Limite de geração de PDFs |
| Checkouts monitorados | Limite de registros de checkout |

> **Nota:** Tiers e valores a definir. Estrutura técnica deve suportar múltiplos planos com limites configuráveis por dimensão.

### 6.3 Fluxo de Assinatura

```
Usuário cria workspace
  → Seleciona plano (modal/página de planos)
  → Checkout transparente embutido (AbacatePay)
  → Webhook confirma pagamento
  → Workspace ativado com limites do plano
  → Renovação automática mensal/anual
```

---

## 7. Design System

### 7.1 Tema Visual

- **Tema único:** Dark premium (sem modo claro)
- **Cor primária:** Verde — `HSL 142 72% 50%`
- **Background:** zinc-950 — `HSL 240 6% 6%`
- **Cards:** zinc-900 — `HSL 240 5% 10%`
- **Bordas:** zinc-800 — `HSL 240 4% 18%`
- **Border radius padrão:** `0.75rem`

### 7.2 Tokens Customizados

| Token | Valor |
|-------|-------|
| `glass-card` | `bg-card/70` + `backdrop-blur-xl` + borda |
| `glass-navbar` | `bg-card/60` + `backdrop-blur-2xl` |
| `text-label` | uppercase + tracking-wider + muted |
| `glow-sm` / `glow-md` | box-shadow verde para ênfase |
| `hover-lift` | `translateY(-2px)` + sombra no hover |

### 7.3 Animações

| Animação | Descrição | Duração |
|----------|-----------|---------|
| `animate-float` | Flutuação vertical suave | 6s |
| `animate-glow-pulse` | Pulsação de opacidade | 4s |
| `animate-particle` | Partículas ascendentes | 15s |
| `animate-line-draw` | Desenho progressivo SVG | 3s |
| Framer Motion | Transições de página (fade + scale + translate) | — |

### 7.4 Componentes Base (shadcn/ui)

Accordion, AlertDialog, Avatar, Badge, Button, Calendar, Card, Checkbox, Collapsible, Command, ContextMenu, Dialog, Drawer, DropdownMenu, Form, HoverCard, Input, Label, Menubar, NavigationMenu, Pagination, Popover, Progress, RadioGroup, ScrollArea, Select, Separator, Sheet, Sidebar, Skeleton, Slider, Switch, Table, Tabs, Textarea, Toast, Toggle, Tooltip

### 7.5 Componentes Customizados

| Componente | Descrição |
|------------|-----------|
| `Modal` | Wrapper reutilizável com overlay blur, fade+scale, header/content/footer |
| `ParticleBackground` | Fundo animado com partículas, linhas SVG e orbs de gradiente |
| `MetricCard` | Card de métrica reutilizável |
| `NavLink` | Link de navegação com estado ativo |

---

## 8. Módulos Funcionais

### 8.1 Autenticação & Onboarding

**Escopo v1.0:**
- [ ] Cadastro por email + senha
- [ ] Login por email + senha
- [ ] OAuth Google e GitHub
- [ ] "Lembrar-me" (sessão persistente)
- [ ] Recuperação de senha por email
- [ ] Onboarding: criar primeiro workspace após cadastro
- [ ] Convite por email para workspace existente
- [ ] Página de aceite de convite

**Fora do escopo v1.0:**
- 2FA / MFA
- SSO empresarial

**Critérios de aceite:**
- Usuário consegue criar conta, criar workspace e acessar o dashboard em menos de 2 minutos
- Convite por email chega em até 60s e expira em 48h
- Sessão persiste após fechar o navegador quando "Lembrar-me" ativo

---

### 8.2 CRM

**Descrição:** Gerenciamento de leads e pipeline de vendas em formato Kanban.

**Escopo v1.0:**
- [ ] Kanban Board com drag & drop
- [ ] Configuração de etapas do funil (criar, reordenar, remover)
- [ ] Configuração de campos customizados por workspace (texto, email, número, telefone, valor)
- [ ] Moeda configurável por campo de valor (BRL / USD / EUR)
- [ ] Adição de lead com campos dinâmicos
- [ ] Validação de email e formatação automática (telefone, valor)
- [ ] Sheet lateral de detalhe do lead (visualizar, editar, excluir)
- [ ] Flag "visível no kanban" por campo
- [ ] Estado vazio orientando configuração
- [ ] Confirmação para ações destrutivas

**Fora do escopo v1.0:**
- Automações de movimentação de etapa
- Integração com email marketing
- Histórico de alterações do lead

**Critérios de aceite:**
- Lead pode ser movido entre etapas via drag & drop sem recarregar a página
- Campos customizados refletem imediatamente no formulário de criação após configuração
- Exclusão de lead requer confirmação e não pode ser desfeita

---

### 8.3 Contratos

**Descrição:** Geração de contratos em PDF a partir de templates com variáveis dinâmicas.

**Escopo v1.0:**
- [ ] Criação de templates de contrato com editor de texto rico
- [ ] Variáveis dinâmicas: `{{nome_cliente}}`, `{{valor}}`, `{{data_inicio}}`, etc.
- [ ] Preenchimento de variáveis via formulário antes de gerar
- [ ] Geração de PDF do contrato
- [ ] Download do PDF gerado
- [ ] Histórico de contratos gerados por workspace
- [ ] Vinculação de contrato a lead do CRM
- [ ] Status de contrato (rascunho, enviado, assinado, cancelado)

**Fora do escopo v1.0:**
- Assinatura digital
- Envio de contrato por email direto da plataforma
- Templates com cláusulas condicionais

**Critérios de aceite:**
- PDF gerado deve ser fiel ao template com variáveis substituídas corretamente
- Template salvo persiste entre sessões
- PDF gerado em menos de 5 segundos

---

### 8.4 Emissão de Notas Fiscais (NF-e / NFS-e)

**Descrição:** Emissão e gestão de Notas Fiscais de produto (NF-e) e serviço (NFS-e).

**Escopo v1.0:**
- [ ] Emissão de NFS-e (nota de serviço)
- [ ] Emissão de NF-e (nota de produto)
- [ ] Formulário de emissão com campos obrigatórios por tipo
- [ ] Consulta de NF emitidas (histórico com filtros)
- [ ] Extração / leitura de NF recebidas (upload de XML ou PDF)
- [ ] Download de XML e DANFE
- [ ] Status de NF (autorizada, cancelada, rejeitada, pendente)
- [ ] Vinculação de NF a registro financeiro / checkout

**Fora do escopo v1.0:**
- Carta de correção eletrônica (CC-e)
- Manifestação do destinatário
- Integração com contabilidade

**Critérios de aceite:**
- NFS-e emitida retorna autorização da prefeitura em até 30s
- NF-e emitida retorna autorização da SEFAZ em até 60s
- XML baixado é válido e aceito pela SEFAZ
- Extração de NF recebida lê campos principais corretamente (emitente, valor, data, CNPJ)

> **Dependência:** Definir API/integrador de NF-e (ex: Focus NFe, NFe.io, Plugnotas). Impacta escopo real de emissão.

---

### 8.5 Checkout Manager

**Descrição:** Dashboard de acompanhamento de vendas e transações dos checkouts do usuário.

**Escopo v1.0:**
- [ ] Cards de resumo: Total de vendas, Aprovadas, Recusadas, Carrinhos abandonados, Reembolsos
- [ ] Tabela de transações: Nome, Email, Produto, Status, Valor, Data
- [ ] Badges de status coloridos por tipo
- [ ] Filtros por status, período e produto
- [ ] Seção de Webhook: URL configurável, copiar URL, gerar nova URL
- [ ] Histórico de eventos do webhook (recebidos, falhos, reprocessar)
- [ ] Scroll com header fixo

**Fora do escopo v1.0:**
- Criação de páginas de checkout
- Gestão de produtos/catálogo
- Split de pagamento

**Critérios de aceite:**
- Webhook recebe eventos e atualiza tabela em tempo real (ou próxima recarga)
- Geração de nova URL de webhook invalida a anterior
- Filtros não recarregam a página

---

### 8.6 Captação de Leads

**Descrição:** Busca e importação de leads via scraping do Google através de API própria, com inserção direta no CRM.

**Escopo v1.0:**
- [ ] Formulário de busca: palavra-chave, localização, filtros
- [ ] Listagem de resultados com dados do lead (nome, email, telefone, site)
- [ ] Seleção individual ou em lote para importar ao CRM
- [ ] Escolha de etapa do funil ao importar
- [ ] Histórico de buscas realizadas
- [ ] Indicador de limite de leads captados no mês (por plano)

**Fora do escopo v1.0:**
- Enriquecimento de dados via APIs externas
- Busca em outras fontes além da API própria
- Automação de busca agendada

**Critérios de aceite:**
- Busca retorna resultados em menos de 10s
- Leads importados aparecem imediatamente na etapa selecionada do CRM
- Limite do plano exibe alerta ao atingir 80% e bloqueia ao atingir 100%

---

### 8.7 Agenda

**Descrição:** Gerenciamento de agendamentos com calendário mensal e configuração de horários disponíveis.

**Escopo v1.0:**
- [ ] Calendário mensal: grid 7 colunas, navegação entre meses
- [ ] Destaque do dia atual
- [ ] Badge com contagem de agendamentos por dia
- [ ] Modal de dia: lista de consultas com horário, título e badge de status
- [ ] Modal novo agendamento: título, data, seleção de slot disponível
- [ ] Modal de configurações: dias ativos, hora início/fim, intervalo (15/20/30/45/60 min)
- [ ] Geração dinâmica de slots baseada nas configurações
- [ ] Status de agendamento: confirmado, pendente, cancelado
- [ ] Vinculação de agendamento a lead do CRM

**Fora do escopo v1.0:**
- Link público de agendamento (tipo Calendly)
- Notificações/lembretes automáticos
- Integração com Google Calendar

**Critérios de aceite:**
- Slots gerados respeitam dias ativos e intervalo configurado
- Agendamento em slot já ocupado é bloqueado
- Alteração de configuração recalcula slots sem perder agendamentos existentes

---

### 8.8 Pagamentos

**Descrição:** Histórico de registros financeiros e controle de receitas, despesas e comissões.

**Escopo v1.0:**
- [ ] Cards de métricas: Ganhos, Saídas, Comissões, Lucro Líquido, Meta Receita, Meta Lucro
- [ ] Cálculos derivados: receita confirmada, despesas totais, comissão (% configurável), lucro líquido
- [ ] Barras de progresso de metas
- [ ] Tabela financeira com filtro por tipo (Receita / Despesa / Comissão)
- [ ] Ordenação por data
- [ ] Badges coloridos por tipo de registro
- [ ] Modal novo registro: tipo, data, descrição, categoria, valor, status
- [ ] Modal configurar comissão: percentual editável
- [ ] Modal configurar metas: meta de receita e lucro

**Fora do escopo v1.0:**
- Relatórios e exportação (CSV, PDF)
- Categorias customizadas
- Conciliação bancária

**Critérios de aceite:**
- Métricas recalculam imediatamente após inserção de novo registro
- Filtro por tipo não recarrega a página
- Meta exibe porcentagem de progresso correta

---

### 8.9 Follow-up

**Descrição:** Sistema de acompanhamento automatizado com motor de regras e kanban de ações pendentes.

**Escopo v1.0:**
- [ ] Cards de resumo: Pendentes, Hoje, Atrasados, Concluídos
- [ ] Kanban 5 colunas: Atrasados, Hoje, Próximos 3 dias, Esta Semana, Concluídos
- [ ] Cards compactos: nome do lead, motivo, data, botão de ação
- [ ] Popover de ação: WhatsApp ou E-mail
- [ ] Marcar como concluído ao disparar ação
- [ ] Modal de detalhes: produto, origem, motivo, canal, nível, prioridade
- [ ] Timeline de histórico do lead (todos os follow-ups do mesmo lead agrupados)
- [ ] Motor de regras: gera sequências com delays por motivo (ex: carrinho abandonado → [1, 3, 7] dias)
- [ ] Priorização automática por motivo (alta/média/baixa)

**Fora do escopo v1.0:**
- Envio real de WhatsApp / Email (v1 é simulação com toast)
- Editor de regras pela interface
- Templates de mensagem

**Critérios de aceite:**
- Follow-ups aparecem na coluna correta baseado na data `scheduledFor`
- Motor gera sequência completa ao criar follow-up de carrinho abandonado
- Timeline mostra todos os follow-ups do lead em ordem cronológica

---

### 8.10 Gestão de Usuários & Workspace

**Descrição:** Administração de membros, cargos e permissões dentro do workspace.

**Escopo v1.0:**
- [ ] Tabela de usuários: Nome, Email, Telefone, Cargo(s), Ações
- [ ] Filtros: busca por nome/email + filtro por cargo
- [ ] CRUD completo de usuários via modais
- [ ] Convite de novo membro por email
- [ ] Gestão de cargos: criar, remover, reordenar
- [ ] Permissões por módulo: visualizar / editar por cargo
- [ ] Gerenciar cargos de usuário individual
- [ ] Confirmação para ações destrutivas
- [ ] Dropdown de ações por usuário

**Fora do escopo v1.0:**
- Log de auditoria de ações de usuários
- Autenticação SSO / SAML

**Critérios de aceite:**
- Convite por email expira em 48h
- Remoção de membro revoga acesso imediatamente
- Permissões de cargo aplicam-se em tempo real sem necessidade de relogin

---

## 9. Integrações Externas

| Integração | Módulo(s) | Status | Notas |
|------------|-----------|--------|-------|
| Supabase Auth | Autenticação | 🟡 Provável | Email + OAuth |
| Supabase DB (PostgreSQL) | Todos | 🟡 Provável | RLS por workspace_id |
| Supabase Storage | Contratos, NF-e | 🟡 Provável | PDFs, XMLs |
| Supabase Edge Functions | NF-e, Webhooks | 🟡 A confirmar | Lógica server-side |
| AbacatePay | Planos & Billing | 🟡 Provável | Checkout transparente |
| API NF-e/NFS-e | Notas Fiscais | ⏳ A definir | Focus NFe / NFe.io / Plugnotas |
| API Scraping própria | Captação de Leads | ✅ Definido | API já existente |
| Google OAuth | Autenticação | ✅ Definido | Via Supabase Auth |
| GitHub OAuth | Autenticação | ✅ Definido | Via Supabase Auth |

---

## 10. Requisitos Não-Funcionais

### 10.1 Performance

| Métrica | Meta |
|---------|------|
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3s |
| Carregamento de tabelas (até 100 registros) | < 500ms |
| Geração de PDF de contrato | < 5s |
| Emissão de NF-e (resposta SEFAZ) | < 60s |
| Busca de leads via API | < 10s |

### 10.2 Segurança

- Row Level Security (RLS) em todas as tabelas sensíveis
- Todos os endpoints autenticados com token JWT
- Dados de NF criptografados em repouso
- Webhook URLs geradas com `crypto.randomUUID`
- Sanitização de inputs em todos os formulários
- Rate limiting em endpoints de scraping e emissão de NF
- HTTPS obrigatório em produção
- Secrets via variáveis de ambiente (nunca no frontend)

### 10.3 Escalabilidade

- Arquitetura stateless no frontend (estado no servidor via Supabase)
- Paginação em todas as tabelas com > 50 registros
- Lazy loading de módulos por rota
- Imagens e assets via CDN

### 10.4 Disponibilidade

- Uptime alvo: 99.5% (excluindo janelas de manutenção)
- Dependências críticas: Supabase SLA, API NF-e SLA

### 10.5 Acessibilidade

- Suporte a navegação por teclado nos componentes principais
- Contraste mínimo WCAG AA para textos sobre backgrounds escuros
- Labels em todos os campos de formulário

---

## 11. Roadmap

### v1.0 — Lançamento Inicial

> Objetivo: Plataforma funcional com todos os módulos core, multi-workspace, sistema de planos.

- [ ] Design system implementado (rebuild from scratch)
- [ ] Autenticação completa (email + OAuth)
- [ ] Multi-workspace + hierarquia de usuários
- [ ] CRM com kanban e campos dinâmicos
- [ ] Contratos com templates e geração de PDF
- [ ] NF-e + NFS-e (emissão + extração)
- [ ] Checkout Manager com webhooks
- [ ] Captação de leads via API própria
- [ ] Agenda com configuração de slots
- [ ] Pagamentos com dashboard financeiro
- [ ] Follow-up com motor de regras
- [ ] Sistema de planos com checkout embutido (AbacatePay)
- [ ] Gestão de usuários e permissões por workspace

### v1.x — Melhorias Pós-Lançamento

- [ ] Envio real de WhatsApp e Email no Follow-up
- [ ] Templates de mensagem para Follow-up
- [ ] Editor de regras de Follow-up pela interface
- [ ] Exportação de relatórios (CSV, PDF)
- [ ] Link público de agendamento (tipo Calendly)
- [ ] Notificações e lembretes de agenda

### v2.0 — Expansão

- [ ] Assinatura digital em contratos
- [ ] Carta de correção eletrônica (CC-e)
- [ ] Integração com Google Calendar
- [ ] Enriquecimento de leads via APIs externas
- [ ] Log de auditoria de ações
- [ ] Modo mobile (PWA ou app nativo)

---

## 12. Riscos & Constraints

### Riscos Técnicos

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| Complexidade de RLS multi-workspace | Alta | Alto | Definir modelo de dados antes de implementar. Testar RLS exaustivamente. |
| Integração NF-e/NFS-e (variação por município/estado) | Alta | Alto | Usar integrador consolidado (Focus NFe, NFe.io). Mapear municípios suportados. |
| AbacatePay ainda em crescimento (instabilidade) | Média | Alto | Abstrair camada de billing para troca de provider com mínimo impacto. |
| API de scraping própria sem SLA definido | Média | Médio | Implementar fallback e tratamento de erros robusto. |
| Backend stack não definido impacta decisões de arquitetura | Alta | Alto | **DECISÃO BLOQUEANTE** — definir Supabase BaaS vs API própria antes do início do dev. |

### Constraints

| Constraint | Detalhe |
|------------|---------|
| Nome do produto | A definir — não bloqueia desenvolvimento técnico |
| Backend stack | Decisão pendente — bloqueia arquitetura de API e RLS |
| Provider de NF-e | A definir — bloqueia módulo de NF completo |
| Tiers de planos | A definir — não bloqueia desenvolvimento técnico inicial |
| Valores de pricing | A definir — não bloqueia desenvolvimento técnico |

### Constraints Legais e Regulatórios

- Emissão de NF-e requer certificado digital A1/A3 do emitente
- NFS-e varia por município (nem todas as prefeituras têm API)
- LGPD: dados de leads captados via scraping precisam de base legal definida
- Dados fiscais devem ser armazenados por 5 anos (obrigação fiscal brasileira)

---

## Decisões Pendentes (Bloqueantes)

| # | Decisão | Responsável | Prazo |
|---|---------|-------------|-------|
| D1 | Backend: Supabase BaaS vs Supabase + API própria | Founder | Antes do início do dev |
| D2 | Integrador de NF-e/NFS-e (Focus NFe, NFe.io, Plugnotas) | Founder | Antes da sprint de NF |
| D3 | Nome do produto | Founder | Antes do lançamento |
| D4 | Tiers e valores dos planos | Founder | Antes da sprint de Billing |
| D5 | Confirmar AbacatePay como processador | Founder | Antes da sprint de Billing |

---

*PRD mantido pelo @pm em colaboração com o Founder.*
*Próxima revisão: após resolução das Decisões Pendentes D1 e D2.*
