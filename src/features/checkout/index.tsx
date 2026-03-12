import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  CheckCircle,
  XCircle,
  LogOut,
  ShoppingCart,
  Webhook,
  Search,
  MousePointerClick,
} from 'lucide-react'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Badge } from '@/shared/components/ui/badge'
import { cn } from '@/shared/lib/utils'
import { staggerContainer, staggerItem } from '@/shared/lib/motion'
import type { CheckoutEvent, CheckoutEventType, FilterTab } from './checkout.types'
import { EventDetailModal } from './components/modals/EventDetailModal'
import { CheckoutWebhookConfigModal } from './components/modals/CheckoutWebhookConfigModal'

// ── Helpers ────────────────────────────────────────────────────────────────

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getPaymentMethodLabel(method?: string, installments?: number) {
  if (!method) return '—'
  if (method === 'credit_card') return installments ? `${installments}x Crédito` : 'Crédito'
  if (method === 'pix') return 'PIX'
  if (method === 'boleto') return 'Boleto'
  return method
}

function getEventLabel(event: CheckoutEventType) {
  const labels: Record<CheckoutEventType, string> = {
    'checkout.clicked': 'Clicado',
    'checkout.abandoned': 'Abandonado',
    'payment.approved': 'Aprovado',
    'payment.rejected': 'Rejeitado',
    'payment.refunded': 'Reembolsado',
  }
  return labels[event]
}

function getEventBadgeVariant(event: CheckoutEventType) {
  switch (event) {
    case 'payment.approved':
      return 'success' as const
    case 'payment.rejected':
      return 'destructive' as const
    case 'checkout.abandoned':
      return 'warning' as const
    case 'payment.refunded':
      return 'secondary' as const
    default:
      return 'default' as const
  }
}

// ── Mock data ──────────────────────────────────────────────────────────────

const mockEvents: CheckoutEvent[] = [
  {
    id: 'evt_001',
    event: 'payment.approved',
    customer: {
      name: 'Ana Souza',
      email: 'ana.souza@email.com',
      phone: '(51) 99876-5432',
      cpf: '123.456.789-00',
    },
    product: { name: 'Plano Pro Anual', id: 'prod_001' },
    value: 1197.0,
    payment_method: 'credit_card',
    installments: 12,
    created_at: '2026-02-28T14:32:00Z',
    checkout_id: 'chk_abc123',
    webhook_payload: {
      event: 'payment.approved',
      amount: 119700,
      currency: 'BRL',
      payment_method: 'credit_card',
      installments: 12,
    },
  },
  {
    id: 'evt_002',
    event: 'checkout.abandoned',
    customer: { name: 'Carlos Lima', email: 'carlos.lima@email.com' },
    product: { name: 'Plano Starter Mensal', id: 'prod_002' },
    value: 97.0,
    created_at: '2026-02-28T13:15:00Z',
    checkout_id: 'chk_def456',
    webhook_payload: { event: 'checkout.abandoned', step: 'payment', checkout_id: 'chk_def456' },
  },
  {
    id: 'evt_003',
    event: 'payment.approved',
    customer: {
      name: 'Mariana Costa',
      email: 'mariana@empresa.com.br',
      phone: '(11) 98765-4321',
    },
    product: { name: 'Plano Pro Mensal', id: 'prod_003' },
    value: 197.0,
    payment_method: 'pix',
    created_at: '2026-02-27T09:44:00Z',
    checkout_id: 'chk_ghi789',
    webhook_payload: {
      event: 'payment.approved',
      amount: 19700,
      currency: 'BRL',
      payment_method: 'pix',
    },
  },
  {
    id: 'evt_004',
    event: 'payment.rejected',
    customer: { name: 'Pedro Alves', email: 'pedro.alves@gmail.com', cpf: '987.654.321-00' },
    product: { name: 'Plano Pro Anual', id: 'prod_001' },
    value: 1197.0,
    payment_method: 'credit_card',
    installments: 12,
    created_at: '2026-02-27T16:20:00Z',
    checkout_id: 'chk_jkl012',
    webhook_payload: {
      event: 'payment.rejected',
      reason: 'insufficient_funds',
      amount: 119700,
      payment_method: 'credit_card',
    },
  },
  {
    id: 'evt_005',
    event: 'checkout.clicked',
    customer: { name: 'Beatriz Ferreira', email: 'bea.ferreira@hotmail.com' },
    product: { name: 'Plano Starter Mensal', id: 'prod_002' },
    value: 97.0,
    created_at: '2026-02-26T11:05:00Z',
    checkout_id: 'chk_mno345',
    webhook_payload: {
      event: 'checkout.clicked',
      source: 'landing_page',
      checkout_id: 'chk_mno345',
    },
  },
  {
    id: 'evt_006',
    event: 'checkout.abandoned',
    customer: { name: 'Ricardo Nunes', email: 'r.nunes@outlook.com' },
    product: { name: 'Plano Pro Anual', id: 'prod_001' },
    value: 1197.0,
    created_at: '2026-02-25T17:50:00Z',
    checkout_id: 'chk_pqr678',
    webhook_payload: {
      event: 'checkout.abandoned',
      step: 'address',
      checkout_id: 'chk_pqr678',
    },
  },
  {
    id: 'evt_007',
    event: 'payment.approved',
    customer: {
      name: 'Sofia Mendes',
      email: 'sofia.mendes@empresa.io',
      phone: '(21) 97654-3210',
      cpf: '456.789.012-34',
    },
    product: { name: 'Plano Pro Mensal', id: 'prod_003' },
    value: 197.0,
    payment_method: 'boleto',
    created_at: '2026-02-24T08:15:00Z',
    checkout_id: 'chk_stu901',
    webhook_payload: {
      event: 'payment.approved',
      amount: 19700,
      currency: 'BRL',
      payment_method: 'boleto',
    },
  },
]

// ── Filter tabs ────────────────────────────────────────────────────────────

const FILTER_TABS: { label: string; value: FilterTab }[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Aprovados', value: 'payment.approved' },
  { label: 'Abandonados', value: 'checkout.abandoned' },
  { label: 'Clicados', value: 'checkout.clicked' },
  { label: 'Rejeitados', value: 'payment.rejected' },
  { label: 'Reembolsados', value: 'payment.refunded' },
]

// ── Page ───────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all')
  const [search, setSearch] = useState('')
  const [selectedEvent, setSelectedEvent] = useState<CheckoutEvent | null>(null)
  const [showWebhookConfig, setShowWebhookConfig] = useState(false)

  // Metrics derived from mock data
  const approvedRevenue = mockEvents
    .filter((e) => e.event === 'payment.approved')
    .reduce((sum, e) => sum + e.value, 0)
  const approvedCount = mockEvents.filter((e) => e.event === 'payment.approved').length
  const clickedCount = mockEvents.filter((e) => e.event === 'checkout.clicked').length
  const abandonedCount = mockEvents.filter((e) => e.event === 'checkout.abandoned').length
  const rejectedCount = mockEvents.filter((e) => e.event === 'payment.rejected').length

  const metrics = [
    {
      label: 'Receita aprovada',
      value: formatCurrency(approvedRevenue),
      icon: TrendingUp,
      colorClass: 'bg-primary/10 text-primary',
    },
    {
      label: 'Vendas aprovadas',
      value: String(approvedCount),
      icon: CheckCircle,
      colorClass: 'bg-emerald-500/10 text-emerald-400',
    },
    {
      label: 'Checkouts clicados',
      value: String(clickedCount),
      icon: MousePointerClick,
      colorClass: 'bg-sky-500/10 text-sky-400',
    },
    {
      label: 'Abandonados',
      value: String(abandonedCount),
      icon: LogOut,
      colorClass: 'bg-amber-500/10 text-amber-400',
    },
    {
      label: 'Rejeitados',
      value: String(rejectedCount),
      icon: XCircle,
      colorClass: 'bg-red-500/10 text-red-400',
    },
  ]

  // Combined filter: tab + search
  const filteredEvents = mockEvents.filter((event) => {
    const matchesTab = activeFilter === 'all' || event.event === activeFilter
    const searchLower = search.toLowerCase()
    const matchesSearch =
      !search ||
      event.customer.name.toLowerCase().includes(searchLower) ||
      event.customer.email.toLowerCase().includes(searchLower) ||
      event.product.name.toLowerCase().includes(searchLower)
    return matchesTab && matchesSearch
  })

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Checkout"
        description="Gerencie seu gateway de pagamentos e eventos de checkout"
        actions={
          <Button
            size="sm"
            variant="outline"
            className="gap-2"
            onClick={() => setShowWebhookConfig(true)}
          >
            <Webhook className="h-4 w-4" />
            Configurar Webhook
          </Button>
        }
      />

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-6"
      >
        {/* Metric cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {metrics.map((m) => {
            const Icon = m.icon
            return (
              <motion.div
                key={m.label}
                variants={staggerItem}
                className="glass-card rounded-xl p-6 flex items-center gap-4"
              >
                <div
                  className={cn(
                    'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
                    m.colorClass,
                  )}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground truncate">{m.label}</p>
                  <p className="text-2xl font-bold text-foreground">{m.value}</p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Events section */}
        <motion.div variants={staggerItem} className="glass-card rounded-xl p-6 space-y-5">
          <h2 className="text-base font-semibold text-foreground">Eventos de Checkout</h2>

          {/* Filters row */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Tab filters */}
            <div className="flex flex-wrap gap-1">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveFilter(tab.value)}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                    activeFilter === tab.value
                      ? 'bg-primary/20 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative sm:w-64">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Nome, e-mail ou produto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 text-sm"
              />
            </div>
          </div>

          {/* Table or empty state */}
          {filteredEvents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 pr-4 text-left text-xs font-medium text-muted-foreground">
                      Lead
                    </th>
                    <th className="pb-3 pr-4 text-left text-xs font-medium text-muted-foreground">
                      Produto
                    </th>
                    <th className="pb-3 pr-4 text-left text-xs font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="pb-3 pr-4 text-left text-xs font-medium text-muted-foreground">
                      Valor
                    </th>
                    <th className="pb-3 pr-4 text-left text-xs font-medium text-muted-foreground">
                      Data
                    </th>
                    <th className="pb-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredEvents.map((event) => (
                    <tr key={event.id} className="group">
                      {/* Lead */}
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                            {event.customer.name
                              .split(' ')
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join('')}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground truncate">
                              {event.customer.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {event.customer.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Produto */}
                      <td className="py-3 pr-4">
                        <p className="text-foreground max-w-[160px] truncate">
                          {event.product.name}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="py-3 pr-4">
                        <Badge variant={getEventBadgeVariant(event.event)}>
                          {getEventLabel(event.event)}
                        </Badge>
                      </td>

                      {/* Valor + Método */}
                      <td className="py-3 pr-4">
                        <p className="font-medium text-foreground">{formatCurrency(event.value)}</p>
                        <p className="text-xs text-muted-foreground">
                          {getPaymentMethodLabel(event.payment_method, event.installments)}
                        </p>
                      </td>

                      {/* Data */}
                      <td className="py-3 pr-4">
                        <p className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDate(event.created_at)}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="py-3 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => setSelectedEvent(event)}
                        >
                          Ver detalhes
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
              <ShoppingCart className="h-10 w-10 text-muted-foreground/30" />
              <p className="text-sm font-medium text-muted-foreground">
                Nenhum evento encontrado
              </p>
              <p className="text-xs text-muted-foreground/60">
                {search
                  ? 'Tente ajustar os filtros ou a busca'
                  : 'Os eventos aparecerão aqui quando houver atividade'}
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>

      <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      <CheckoutWebhookConfigModal
        open={showWebhookConfig}
        onClose={() => setShowWebhookConfig(false)}
      />
    </div>
  )
}
