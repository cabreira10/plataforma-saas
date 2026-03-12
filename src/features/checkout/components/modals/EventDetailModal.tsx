import { useState } from 'react'
import { Copy, Check, User, Package, CreditCard, Code2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogBody,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import type { CheckoutEvent, CheckoutEventType } from '../../checkout.types'

const EVENT_LABELS: Record<CheckoutEventType, string> = {
  'checkout.clicked': 'Clicado',
  'checkout.abandoned': 'Abandonado',
  'payment.approved': 'Aprovado',
  'payment.rejected': 'Rejeitado',
  'payment.refunded': 'Reembolsado',
}

type BadgeVariant = 'default' | 'success' | 'destructive' | 'warning' | 'secondary'

const EVENT_BADGE_VARIANT: Record<CheckoutEventType, BadgeVariant> = {
  'checkout.clicked': 'default',
  'checkout.abandoned': 'warning',
  'payment.approved': 'success',
  'payment.rejected': 'destructive',
  'payment.refunded': 'secondary',
}

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  pix: 'PIX',
  boleto: 'Boleto',
  credit_card: 'Crédito',
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon: React.ElementType
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {title}
      </div>
      <div className="rounded-lg border border-border bg-card/30 p-3 space-y-2">
        {children}
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-sm text-muted-foreground shrink-0">{label}</span>
      <span className="text-sm text-foreground text-right">{value}</span>
    </div>
  )
}

interface EventDetailModalProps {
  event: CheckoutEvent | null
  onClose: () => void
}

export function EventDetailModal({ event, onClose }: EventDetailModalProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(JSON.stringify(event?.webhook_payload, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isPaymentEvent = event?.event.startsWith('payment.')
  const payload = event?.webhook_payload as Record<string, unknown> | undefined

  return (
    <Dialog open={!!event} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 flex-wrap">
            {event && (
              <Badge variant={EVENT_BADGE_VARIANT[event.event]}>
                {EVENT_LABELS[event.event]}
              </Badge>
            )}
            <span>Detalhe do Evento</span>
          </DialogTitle>
          {event && (
            <div className="flex items-center gap-3 text-xs text-muted-foreground pt-0.5">
              <span>{formatDate(event.created_at)}</span>
              <span className="font-mono text-muted-foreground/60">{event.checkout_id}</span>
            </div>
          )}
        </DialogHeader>

        {event && (
          <DialogBody className="space-y-4">
            {/* CLIENTE */}
            <Section title="Cliente" icon={User}>
              <InfoRow label="Nome" value={event.customer.name} />
              <InfoRow label="E-mail" value={event.customer.email} />
              {event.customer.phone && <InfoRow label="Telefone" value={event.customer.phone} />}
              {event.customer.cpf && <InfoRow label="CPF" value={event.customer.cpf} />}
            </Section>

            {/* PRODUTO */}
            <Section title="Produto" icon={Package}>
              <InfoRow label="Nome" value={event.product.name} />
              <InfoRow
                label="ID"
                value={<span className="font-mono text-xs">{event.product.id}</span>}
              />
              <InfoRow label="Valor" value={formatCurrency(event.value)} />
            </Section>

            {/* PAGAMENTO */}
            {isPaymentEvent && (
              <Section title="Pagamento" icon={CreditCard}>
                {event.payment_method && (
                  <InfoRow
                    label="Método"
                    value={
                      event.payment_method === 'credit_card' && event.installments
                        ? `${event.installments}x ${PAYMENT_METHOD_LABELS[event.payment_method]}`
                        : PAYMENT_METHOD_LABELS[event.payment_method]
                    }
                  />
                )}
                <InfoRow
                  label="Status"
                  value={
                    <Badge variant={EVENT_BADGE_VARIANT[event.event]}>
                      {EVENT_LABELS[event.event]}
                    </Badge>
                  }
                />
                {event.event === 'payment.rejected' && payload?.reason && (
                  <InfoRow
                    label="Razão"
                    value={
                      <span className="font-mono text-xs text-destructive">
                        {String(payload.reason)}
                      </span>
                    }
                  />
                )}
              </Section>
            )}

            {/* PAYLOAD DO WEBHOOK */}
            <Section title="Payload do Webhook" icon={Code2}>
              <div className="relative">
                <pre className="text-xs font-mono text-muted-foreground bg-background/50 rounded p-3 overflow-auto max-h-40 whitespace-pre-wrap break-all">
                  {JSON.stringify(event.webhook_payload, null, 2)}
                </pre>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute right-2 top-2 h-7 gap-1.5 text-xs"
                  onClick={handleCopyPayload}
                >
                  {copied ? (
                    <Check className="h-3 w-3 text-primary" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  {copied ? 'Copiado!' : 'Copiar'}
                </Button>
              </div>
            </Section>
          </DialogBody>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
