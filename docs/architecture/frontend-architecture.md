# Arquitetura Frontend — [NOME_DO_PRODUTO]
> Versão: 0.1 | Status: Aprovado para implementação | Data: 2026-02-22

---

## Índice

1. [Visão Geral](#1-visão-geral)
2. [Stack Completa](#2-stack-completa)
3. [Estrutura de Pastas](#3-estrutura-de-pastas)
4. [Roteamento](#4-roteamento)
5. [State Management](#5-state-management)
6. [Internacionalização (i18n)](#6-internacionalização-i18n)
7. [Design System](#7-design-system)
8. [Hierarquia de Componentes](#8-hierarquia-de-componentes)
9. [Data Flow](#9-data-flow)
10. [Animações](#10-animações)
11. [Convenções de Código](#11-convenções-de-código)
12. [Performance](#12-performance)
13. [Estrutura de Arquivos — Referência Completa](#13-estrutura-de-arquivos--referência-completa)

---

## 1. Visão Geral

### Princípios Arquiteturais

| Princípio | Aplicação |
|-----------|-----------|
| **Feature-first** | Código organizado por domínio de negócio, não por tipo de arquivo |
| **Colocação** | Componente, hook, tipo e teste ficam juntos na mesma feature |
| **Separação de concerns** | UI desacoplada da lógica de dados (hooks) e da lógica de negócio (services) |
| **Server state vs Client state** | TanStack Query cuida de dados do servidor; Zustand cuida de estado de UI global |
| **i18n-first** | Nenhuma string hardcoded em português — tudo via sistema de tradução desde o início |
| **Lazy loading** | Cada feature/rota carrega sob demanda |
| **Type safety** | TypeScript strict em todo o projeto |

---

## 2. Stack Completa

### Core

| Pacote | Versão | Papel |
|--------|--------|-------|
| `react` | 18.x | UI library |
| `typescript` | 5.x | Type safety |
| `vite` | 5.x | Build tool + dev server |
| `react-router-dom` | 6.x | Roteamento SPA |

### Estilização & UI

| Pacote | Papel |
|--------|-------|
| `tailwindcss` | Utility-first CSS |
| `shadcn/ui` | Componentes base (Radix UI) |
| `class-variance-authority` | Variantes de componentes |
| `tailwind-merge` + `clsx` | Merge de classes CSS |
| `framer-motion` | Animações e transições |

### State Management

| Pacote | Papel |
|--------|-------|
| `zustand` | Estado global de UI (sidebar, modais, preferências) |
| `@tanstack/react-query` | Server state: cache, fetch, mutations, invalidação |

### i18n

| Pacote | Papel |
|--------|-------|
| `i18next` | Core do sistema de tradução |
| `react-i18next` | Hooks e componentes React |
| `i18next-browser-languagedetector` | Detecção automática do idioma do browser |
| `i18next-http-backend` | Carregamento lazy de arquivos de tradução |

### Dados & Formulários

| Pacote | Papel |
|--------|-------|
| `@tanstack/react-query` | Fetching + cache de dados |
| `react-hook-form` | Gerenciamento de formulários |
| `zod` | Validação de schemas (formulários + API) |
| `@hookform/resolvers` | Integração zod + react-hook-form |
| `date-fns` | Manipulação de datas |

### Utilitários

| Pacote | Papel |
|--------|-------|
| `lucide-react` | Iconografia |
| `sonner` | Toast notifications |
| `recharts` | Gráficos (dashboard financeiro) |
| `@dnd-kit/core` + `@dnd-kit/sortable` | Drag & drop (CRM Kanban, reordenação) |

> **Nota:** Substituir HTML5 DnD nativo por `@dnd-kit` — acessível, performático, suporte a touch.

### Dev & Qualidade

| Pacote | Papel |
|--------|-------|
| `eslint` + `eslint-config-react` | Linting |
| `prettier` | Formatação |
| `vitest` | Testes unitários |
| `@testing-library/react` | Testes de componentes |
| `husky` + `lint-staged` | Git hooks (lint antes do commit) |

---

## 3. Estrutura de Pastas

### Filosofia: Feature-Based (Domain-Driven)

Cada módulo do produto é uma **feature independente** com seus próprios componentes, hooks, tipos, services e traduções. Código compartilhado fica em `shared/`.

```
src/
├── app/                        # Configuração global da aplicação
│   ├── App.tsx                 # Root component
│   ├── router.tsx              # Definição de todas as rotas
│   ├── providers.tsx           # Composição de todos os providers globais
│   └── query-client.ts         # Configuração do TanStack Query
│
├── features/                   # Módulos de negócio (um por página/domínio)
│   ├── auth/                   # Autenticação & onboarding
│   ├── dashboard/              # Dashboard financeiro
│   ├── crm/                    # CRM & leads
│   ├── contracts/              # Contratos
│   ├── invoices/               # NF-e / NFS-e
│   ├── checkout/               # Checkout manager
│   ├── leads-capture/          # Captação de leads
│   ├── schedule/               # Agenda
│   ├── payments/               # Pagamentos & financeiro
│   ├── follow-up/              # Follow-up
│   ├── users/                  # Gestão de usuários & workspace
│   └── billing/                # Planos & assinatura
│
├── shared/                     # Código reutilizável entre features
│   ├── components/             # Componentes genéricos
│   ├── hooks/                  # Hooks genéricos
│   ├── layouts/                # Layouts de página
│   ├── lib/                    # Configurações de libs externas
│   ├── stores/                 # Stores Zustand globais
│   ├── types/                  # Tipos globais compartilhados
│   └── utils/                  # Funções utilitárias
│
├── locales/                    # Arquivos de tradução
│   ├── pt-BR/
│   │   ├── common.json         # Termos globais
│   │   ├── auth.json
│   │   ├── crm.json
│   │   ├── invoices.json
│   │   └── ...                 # Um arquivo por feature
│   ├── en/
│   │   └── ...                 # Espelho de pt-BR
│   └── es/                     # Espanhol (futuro)
│
├── styles/
│   ├── globals.css             # Reset + variáveis CSS + tokens
│   └── animations.css          # Keyframes customizadas
│
└── main.tsx                    # Entry point
```

### Estrutura Interna de uma Feature

```
features/crm/
├── components/                 # Componentes específicos do CRM
│   ├── KanbanBoard.tsx
│   ├── KanbanColumn.tsx
│   ├── LeadCard.tsx
│   ├── LeadDetailSheet.tsx
│   ├── AddLeadModal.tsx
│   ├── StageSettingsModal.tsx
│   └── FieldSettingsModal.tsx
│
├── hooks/                      # Hooks de dados do CRM
│   ├── useLeads.ts             # TanStack Query: fetch/mutation de leads
│   ├── useStages.ts            # TanStack Query: fetch/mutation de etapas
│   └── useCrmFilters.ts        # Estado local de filtros
│
├── stores/                     # Estado de UI específico do CRM (Zustand)
│   └── crm.store.ts            # Ex: leadSelecionado, modalAberto
│
├── services/                   # Chamadas de API do CRM
│   └── crm.service.ts          # getLeads(), createLead(), updateLead()...
│
├── schemas/                    # Validações Zod
│   └── lead.schema.ts          # Schema de criação/edição de lead
│
├── types/                      # Tipos TypeScript do CRM
│   └── crm.types.ts            # Lead, Stage, CrmField...
│
├── utils/                      # Utilitários específicos
│   └── crm.utils.ts            # formatLeadValue(), sortByStage()...
│
└── index.tsx                   # Página principal do CRM (entry point da rota)
```

---

## 4. Roteamento

### Estrutura de Rotas

```tsx
// src/app/router.tsx

const router = createBrowserRouter([
  // Rotas públicas (sem autenticação)
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <Navigate to="/login" replace /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'invite/:token', element: <InviteAcceptPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
    ],
  },

  // Rotas autenticadas (com workspace)
  {
    path: '/app',
    element: <AuthGuard />,          // Verifica auth, redireciona se não logado
    children: [
      {
        element: <WorkspaceGuard />, // Verifica workspace ativo
        children: [
          {
            element: <AuthenticatedLayout />, // Sidebar + Outlet
            children: [
              { index: true, element: <Navigate to="dashboard" replace /> },
              { path: 'dashboard',    element: <DashboardPage /> },
              { path: 'crm',          element: <CrmPage /> },
              { path: 'contracts',    element: <ContractsPage /> },
              { path: 'invoices',     element: <InvoicesPage /> },
              { path: 'checkout',     element: <CheckoutPage /> },
              { path: 'leads',        element: <LeadCapturePage /> },
              { path: 'schedule',     element: <SchedulePage /> },
              { path: 'payments',     element: <PaymentsPage /> },
              { path: 'follow-up',    element: <FollowUpPage /> },
              { path: 'users',        element: <UsersPage /> },
              { path: 'billing',      element: <BillingPage /> },
              { path: 'settings',     element: <SettingsPage /> },
            ],
          },
        ],
      },
    ],
  },

  // Workspace selector (usuário logado mas sem workspace ativo)
  {
    path: '/workspaces',
    element: <AuthGuard />,
    children: [
      { index: true, element: <WorkspaceSelectorPage /> },
      { path: 'new', element: <CreateWorkspacePage /> },
    ],
  },

  // 404
  { path: '*', element: <NotFoundPage /> },
])
```

### Guards de Rota

```tsx
// AuthGuard: redireciona para /login se não autenticado
// WorkspaceGuard: redireciona para /workspaces se sem workspace ativo
// PermissionGuard: bloqueia rota se cargo não tem permissão
```

### Lazy Loading por Rota

```tsx
// Todas as páginas são lazy — carregam sob demanda
const DashboardPage   = lazy(() => import('@/features/dashboard'))
const CrmPage         = lazy(() => import('@/features/crm'))
const InvoicesPage    = lazy(() => import('@/features/invoices'))
// ...
```

---

## 5. State Management

### Regra de Ouro

| Tipo de Estado | Ferramenta | Exemplos |
|----------------|-----------|----------|
| **Server state** | TanStack Query | Leads, contratos, NFs, usuários do workspace |
| **UI global** | Zustand | Sidebar aberta/fechada, workspace ativo, idioma |
| **UI local** | useState / useReducer | Modal aberto, filtros de tabela, form state |
| **URL state** | React Router | Filtros persistidos, tabs ativas, IDs selecionados |

### Stores Zustand

```tsx
// src/shared/stores/

workspace.store.ts   // workspaceAtivo, listaWorkspaces, trocarWorkspace()
ui.store.ts          // sidebarCollapsed, theme, notifications
auth.store.ts        // user, session, logout()
```

### Exemplo de Store

```tsx
// src/shared/stores/workspace.store.ts
interface WorkspaceStore {
  activeWorkspace: Workspace | null
  workspaces: Workspace[]
  setActiveWorkspace: (workspace: Workspace) => void
}

export const useWorkspaceStore = create<WorkspaceStore>()(
  persist(
    (set) => ({
      activeWorkspace: null,
      workspaces: [],
      setActiveWorkspace: (workspace) =>
        set({ activeWorkspace: workspace }),
    }),
    { name: 'workspace-storage' }
  )
)
```

### Padrão TanStack Query

```tsx
// src/features/crm/hooks/useLeads.ts
export function useLeads(workspaceId: string) {
  return useQuery({
    queryKey: ['leads', workspaceId],
    queryFn: () => crmService.getLeads(workspaceId),
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}

export function useCreateLead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: crmService.createLead,
    onSuccess: (_, { workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: ['leads', workspaceId] })
    },
  })
}
```

---

## 6. Internacionalização (i18n)

### Setup

```
Idiomas suportados no v1.0:
  - pt-BR (padrão)
  - en    (inglês)

Idiomas planejados (futuro):
  - es    (espanhol)
```

### Configuração

```tsx
// src/shared/lib/i18n.ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'pt-BR',
    supportedLngs: ['pt-BR', 'en'],
    defaultNS: 'common',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    interpolation: {
      escapeValue: false,
    },
  })
```

### Estrutura dos Arquivos de Tradução

```json
// locales/pt-BR/common.json
{
  "actions": {
    "save": "Salvar",
    "cancel": "Cancelar",
    "delete": "Excluir",
    "edit": "Editar",
    "create": "Criar",
    "confirm": "Confirmar",
    "back": "Voltar",
    "search": "Buscar"
  },
  "status": {
    "active": "Ativo",
    "inactive": "Inativo",
    "pending": "Pendente",
    "completed": "Concluído"
  },
  "errors": {
    "generic": "Algo deu errado. Tente novamente.",
    "notFound": "Recurso não encontrado.",
    "unauthorized": "Você não tem permissão para esta ação."
  }
}
```

```json
// locales/pt-BR/crm.json
{
  "title": "CRM",
  "lead": {
    "create": "Novo Lead",
    "edit": "Editar Lead",
    "delete": "Excluir Lead",
    "deleteConfirm": "Tem certeza que deseja excluir {{name}}?"
  },
  "stage": {
    "label": "Etapa",
    "create": "Nova Etapa",
    "empty": "Sem leads nesta etapa"
  },
  "field": {
    "label": "Campo",
    "types": {
      "text": "Texto",
      "email": "E-mail",
      "phone": "Telefone",
      "number": "Número",
      "currency": "Valor"
    }
  },
  "empty": {
    "title": "Configure seu funil",
    "description": "Crie etapas e campos para começar a gerenciar seus leads."
  }
}
```

### Uso nos Componentes

```tsx
// Uso básico
const { t } = useTranslation('crm')
<Button>{t('lead.create')}</Button>

// Com namespace múltiplo
const { t } = useTranslation(['crm', 'common'])
<p>{t('common:actions.save')}</p>

// Com interpolação
<p>{t('lead.deleteConfirm', { name: lead.name })}</p>

// Com pluralização
<p>{t('leads.count', { count: leads.length })}</p>
```

### Seletor de Idioma

- Disponível nas configurações do usuário
- Persiste no perfil do usuário (Supabase)
- Fallback: localStorage → navigator.language → pt-BR

---

## 7. Design System

### Tokens CSS (globals.css)

```css
:root {
  /* Cores principais */
  --primary: 142 72% 50%;          /* Verde */
  --background: 240 6% 6%;         /* zinc-950 */
  --card: 240 5% 10%;              /* zinc-900 */
  --border: 240 4% 18%;            /* zinc-800 */
  --muted: 240 4% 46%;
  --muted-foreground: 240 5% 65%;
  --foreground: 0 0% 98%;
  --radius: 0.75rem;

  /* Glow */
  --glow-sm: 0 0 10px hsl(142 72% 50% / 0.3);
  --glow-md: 0 0 20px hsl(142 72% 50% / 0.4), 0 0 40px hsl(142 72% 50% / 0.2);
}
```

### Tailwind Config

```ts
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--primary))',
        background: 'hsl(var(--background))',
        card: 'hsl(var(--card))',
        border: 'hsl(var(--border))',
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
      },
      boxShadow: {
        'glow-sm': 'var(--glow-sm)',
        'glow-md': 'var(--glow-md)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        particle: {
          '0%': { transform: 'translateY(100vh)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(-10vh)', opacity: '0' },
        },
        'line-draw': {
          from: { strokeDashoffset: '1000' },
          to: { strokeDashoffset: '0' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 4s ease-in-out infinite',
        particle: 'particle 15s linear infinite',
        'line-draw': 'line-draw 3s ease-in-out forwards',
      },
    },
  },
}
```

### Classes Utilitárias Customizadas

```css
/* globals.css — utilitários reutilizáveis */

.glass-card {
  @apply bg-card/70 backdrop-blur-xl border border-border/50 rounded-[var(--radius)];
}

.glass-navbar {
  @apply bg-card/60 backdrop-blur-2xl border-b border-border/30;
}

.text-label {
  @apply text-xs uppercase tracking-wider text-muted-foreground font-medium;
}

.hover-lift {
  @apply transition-all duration-200 hover:-translate-y-0.5 hover:shadow-glow-sm;
}

.glow-border {
  @apply border border-primary/30 shadow-glow-sm;
}
```

---

## 8. Hierarquia de Componentes

### Níveis de Componentes

```
Nível 1 — Primitivos (shadcn/ui + Radix)
  Button, Input, Select, Dialog, Sheet, Badge...
  → Nunca modificados diretamente

Nível 2 — Componentes Base Customizados (shared/components)
  Modal, MetricCard, DataTable, PageHeader,
  StatusBadge, ConfirmDialog, EmptyState,
  LoadingSkeleton, ErrorBoundary...
  → Agnósticos de domínio, altamente reutilizáveis

Nível 3 — Componentes de Feature (features/[name]/components)
  LeadCard, KanbanColumn, InvoiceForm,
  FollowUpCard, AppointmentModal...
  → Específicos do domínio, usam componentes do Nível 2

Nível 4 — Páginas (features/[name]/index.tsx)
  CrmPage, DashboardPage, InvoicesPage...
  → Orquestram componentes de feature + hooks de dados
```

### Componentes Base Compartilhados (shared/components/)

```
shared/components/
├── ui/                    # Re-exports shadcn (ponto único de importação)
│   └── index.ts
├── layout/
│   ├── PageHeader.tsx     # Título + ações de página
│   ├── PageSection.tsx    # Seção com título e conteúdo
│   └── EmptyState.tsx     # Estado vazio reutilizável
├── data/
│   ├── DataTable.tsx      # Tabela genérica com sort/filter/pagination
│   ├── MetricCard.tsx     # Card de métrica com valor, label e trend
│   └── StatusBadge.tsx    # Badge de status com cor por tipo
├── feedback/
│   ├── LoadingSkeleton.tsx
│   ├── ErrorBoundary.tsx
│   └── ConfirmDialog.tsx  # AlertDialog de confirmação reutilizável
├── forms/
│   ├── FormField.tsx      # Wrapper de campo com label + erro
│   └── CurrencyInput.tsx  # Input com formatação monetária
└── overlay/
    ├── Modal.tsx          # Wrapper de Dialog com animação
    └── ParticleBackground.tsx
```

---

## 9. Data Flow

### Fluxo Padrão de uma Feature

```
Página (index.tsx)
  │
  ├── useXxx() — TanStack Query              → Supabase API
  │     ├── isLoading → <LoadingSkeleton />
  │     ├── isError   → <ErrorState />
  │     └── data      → passa para componentes
  │
  ├── useXxxStore() — Zustand                → Estado de UI local
  │     └── modalOpen, selectedItem, filters
  │
  └── Componentes de Feature
        └── Recebem data como props
            Disparam mutations via callbacks
```

### Padrão de Mutation com Feedback

```tsx
const { mutate: createLead, isPending } = useCreateLead()

const handleSubmit = (data: LeadFormData) => {
  createLead(data, {
    onSuccess: () => {
      toast.success(t('lead.createSuccess'))
      closeModal()
    },
    onError: () => {
      toast.error(t('common:errors.generic'))
    },
  })
}
```

### Invalidação de Cache

```
mutation onSuccess
  → queryClient.invalidateQueries(['leads', workspaceId])
  → TanStack Query refetch automático
  → UI atualiza sem reload
```

---

## 10. Animações

### Estratégia

| Uso | Ferramenta |
|-----|-----------|
| Transições de página | Framer Motion (`AnimatePresence`) |
| Modais e sheets | Framer Motion (fade + scale) |
| Elementos de lista | Framer Motion (`staggerChildren`) |
| Hover e microinterações | Tailwind CSS (`hover:`, `transition`) |
| Backgrounds decorativos | CSS Keyframes (`animate-float`, `animate-particle`) |
| Drag & drop | @dnd-kit (sem animação manual) |

### Variantes Framer Motion Padrão

```tsx
// src/shared/lib/motion.ts — variantes reutilizáveis

export const fadeIn = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.2 },
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.15 },
}

export const slideInRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.2 },
}

export const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.05 },
  },
}
```

### Transição de Página

```tsx
// AuthenticatedLayout.tsx
<AnimatePresence mode="wait">
  <motion.div key={location.pathname} {...fadeIn}>
    <Outlet />
  </motion.div>
</AnimatePresence>
```

---

## 11. Convenções de Código

### Nomenclatura

| Artefato | Convenção | Exemplo |
|----------|-----------|---------|
| Componentes | PascalCase | `LeadCard.tsx` |
| Hooks | camelCase + prefixo `use` | `useLeads.ts` |
| Stores | camelCase + sufixo `.store` | `crm.store.ts` |
| Services | camelCase + sufixo `.service` | `crm.service.ts` |
| Types | PascalCase para tipos, camelCase para interfaces | `Lead`, `CreateLeadDTO` |
| Schemas Zod | camelCase + sufixo `Schema` | `leadSchema` |
| Utils | camelCase | `formatCurrency.ts` |
| Constantes | SCREAMING_SNAKE_CASE | `MAX_LEADS_PER_PAGE` |

### Imports

```tsx
// Ordem de imports (enforçado por ESLint)
// 1. React
import { useState, useCallback } from 'react'

// 2. Libs externas
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

// 3. Shared (path alias @/)
import { Button } from '@/shared/components/ui'
import { useWorkspaceStore } from '@/shared/stores/workspace.store'

// 4. Feature local (relativo)
import { LeadCard } from './components/LeadCard'
import { useLeads } from './hooks/useLeads'
import type { Lead } from './types/crm.types'
```

### Path Aliases (vite.config.ts)

```ts
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
    '@features': path.resolve(__dirname, './src/features'),
    '@shared': path.resolve(__dirname, './src/shared'),
    '@locales': path.resolve(__dirname, './locales'),
  },
}
```

### Regras de Componente

```tsx
// ✅ Correto
export function LeadCard({ lead, onEdit, onDelete }: LeadCardProps) {
  // ...
}

// ❌ Evitar: default export (dificulta refactoring)
export default function LeadCard() { ... }

// ✅ Tipos sempre explícitos
interface LeadCardProps {
  lead: Lead
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}
```

---

## 12. Performance

### Code Splitting

- Cada rota é lazy-loaded com `React.lazy()`
- Features pesadas (ex: recharts) carregam sob demanda
- `Suspense` com skeleton por rota

### Otimizações de Re-render

```tsx
// Memoização apenas onde há problema comprovado
const MemoizedLeadCard = memo(LeadCard)

// useCallback para handlers passados como props
const handleDelete = useCallback((id: string) => {
  deleteLeadMutation.mutate(id)
}, [deleteLeadMutation])

// useMemo para cálculos pesados
const metrics = useMemo(() =>
  calculateDashboardMetrics(payments), [payments]
)
```

### TanStack Query — Configuração Global

```ts
// src/app/query-client.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,      // 2 minutos
      gcTime: 1000 * 60 * 10,         // 10 minutos no cache
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
```

### Bundle Size

- Importações de `lucide-react` sempre named (tree-shaking)
- `date-fns` importado por função (não `import * as`)
- shadcn/ui copiado localmente (sem bundle overhead)

---

## 13. Estrutura de Arquivos — Referência Completa

```
src/
├── app/
│   ├── App.tsx
│   ├── router.tsx
│   ├── providers.tsx
│   └── query-client.ts
│
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── InviteAcceptForm.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   ├── services/
│   │   │   └── auth.service.ts
│   │   ├── schemas/
│   │   │   └── auth.schema.ts
│   │   ├── types/
│   │   │   └── auth.types.ts
│   │   └── index.tsx           ← LoginPage
│   │
│   ├── dashboard/
│   │   ├── components/
│   │   │   ├── FinancialCards.tsx
│   │   │   ├── FinancialTable.tsx
│   │   │   ├── AddRecordModal.tsx
│   │   │   ├── CommissionModal.tsx
│   │   │   └── GoalsModal.tsx
│   │   ├── hooks/
│   │   │   └── useFinancialMetrics.ts
│   │   ├── types/
│   │   │   └── dashboard.types.ts
│   │   └── index.tsx
│   │
│   ├── crm/
│   │   ├── components/
│   │   │   ├── KanbanBoard.tsx
│   │   │   ├── KanbanColumn.tsx
│   │   │   ├── LeadCard.tsx
│   │   │   ├── LeadDetailSheet.tsx
│   │   │   ├── AddLeadModal.tsx
│   │   │   ├── StageSettingsModal.tsx
│   │   │   └── FieldSettingsModal.tsx
│   │   ├── hooks/
│   │   │   ├── useLeads.ts
│   │   │   └── useStages.ts
│   │   ├── stores/
│   │   │   └── crm.store.ts
│   │   ├── services/
│   │   │   └── crm.service.ts
│   │   ├── schemas/
│   │   │   └── lead.schema.ts
│   │   ├── types/
│   │   │   └── crm.types.ts
│   │   └── index.tsx
│   │
│   ├── contracts/
│   ├── invoices/
│   ├── checkout/
│   ├── leads-capture/
│   ├── schedule/
│   ├── payments/
│   ├── follow-up/
│   ├── users/
│   └── billing/
│
├── shared/
│   ├── components/
│   │   ├── ui/               ← Re-exports shadcn
│   │   ├── layout/
│   │   │   ├── PageHeader.tsx
│   │   │   ├── PageSection.tsx
│   │   │   └── EmptyState.tsx
│   │   ├── data/
│   │   │   ├── DataTable.tsx
│   │   │   ├── MetricCard.tsx
│   │   │   └── StatusBadge.tsx
│   │   ├── feedback/
│   │   │   ├── LoadingSkeleton.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   └── ConfirmDialog.tsx
│   │   ├── forms/
│   │   │   ├── FormField.tsx
│   │   │   └── CurrencyInput.tsx
│   │   └── overlay/
│   │       ├── Modal.tsx
│   │       └── ParticleBackground.tsx
│   │
│   ├── hooks/
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   └── usePermission.ts
│   │
│   ├── layouts/
│   │   ├── AuthenticatedLayout.tsx   ← Sidebar + Outlet
│   │   ├── PublicLayout.tsx          ← Sem sidebar
│   │   └── guards/
│   │       ├── AuthGuard.tsx
│   │       ├── WorkspaceGuard.tsx
│   │       └── PermissionGuard.tsx
│   │
│   ├── lib/
│   │   ├── i18n.ts            ← Configuração i18next
│   │   ├── motion.ts          ← Variantes Framer Motion
│   │   ├── supabase.ts        ← Cliente Supabase
│   │   └── utils.ts           ← cn() e utilitários gerais
│   │
│   ├── stores/
│   │   ├── auth.store.ts
│   │   ├── workspace.store.ts
│   │   └── ui.store.ts
│   │
│   └── types/
│       ├── global.types.ts
│       ├── workspace.types.ts
│       └── permissions.types.ts
│
├── locales/
│   ├── pt-BR/
│   │   ├── common.json
│   │   ├── auth.json
│   │   ├── dashboard.json
│   │   ├── crm.json
│   │   ├── contracts.json
│   │   ├── invoices.json
│   │   ├── checkout.json
│   │   ├── leads.json
│   │   ├── schedule.json
│   │   ├── payments.json
│   │   ├── follow-up.json
│   │   ├── users.json
│   │   └── billing.json
│   └── en/
│       └── (espelho de pt-BR)
│
├── styles/
│   ├── globals.css
│   └── animations.css
│
└── main.tsx
```

---

*Arquitetura definida por @architect | Aprovada para implementação no v1.0*
*Próximo passo: scaffold do projeto + configuração do ambiente de desenvolvimento*
