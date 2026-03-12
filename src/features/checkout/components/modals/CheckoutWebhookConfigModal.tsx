import { useState } from 'react'
import { Webhook, Copy, RefreshCw, Check, Eye, EyeOff } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogBody,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Badge } from '@/shared/components/ui/badge'
import { Checkbox } from '@/shared/components/ui/checkbox'

interface CheckoutWebhookConfigModalProps {
  open: boolean
  onClose: () => void
}

const mockWebhookUrl = 'https://api.seudominio.com/webhooks/checkout/abc123xyz'
const mockSecret = 'whsec_8c3f1a9d2e7b4f0c6a5d8e2f1b4c7a9d'

const checkoutEvents = [
  { id: 'checkout.clicked', label: 'Checkout clicado' },
  { id: 'checkout.abandoned', label: 'Checkout abandonado' },
  { id: 'payment.approved', label: 'Pagamento aprovado' },
  { id: 'payment.rejected', label: 'Pagamento rejeitado' },
  { id: 'payment.refunded', label: 'Pagamento reembolsado' },
  { id: 'payment.chargeback', label: 'Chargeback' },
]

export function CheckoutWebhookConfigModal({ open, onClose }: CheckoutWebhookConfigModalProps) {
  const [copied, setCopied] = useState<string | null>(null)
  const [showSecret, setShowSecret] = useState(false)
  const [selectedEvents, setSelectedEvents] = useState<string[]>([
    'payment.approved',
    'payment.rejected',
    'checkout.abandoned',
  ])

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const toggleEvent = (eventId: string) => {
    setSelectedEvents((prev) =>
      prev.includes(eventId) ? prev.filter((e) => e !== eventId) : [...prev, eventId],
    )
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Webhook className="h-5 w-5 text-primary" />
            Configurar Webhook
          </DialogTitle>
        </DialogHeader>

        <DialogBody className="space-y-5">
          {/* Status */}
          <div className="flex items-center justify-between rounded-lg bg-card/50 border border-border px-3 py-2">
            <span className="text-sm text-muted-foreground">Status</span>
            <Badge variant="success">Ativo</Badge>
          </div>

          {/* URL */}
          <div className="space-y-1.5">
            <Label>URL do Webhook</Label>
            <div className="flex gap-2">
              <Input value={mockWebhookUrl} readOnly className="text-xs text-muted-foreground" />
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleCopy(mockWebhookUrl, 'url')}
              >
                {copied === 'url' ? (
                  <Check className="h-4 w-4 text-primary" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Secret */}
          <div className="space-y-1.5">
            <Label>Chave secreta</Label>
            <div className="flex gap-2">
              <Input
                value={showSecret ? mockSecret : '•'.repeat(32)}
                readOnly
                className="text-xs font-mono text-muted-foreground"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={() => setShowSecret((s) => !s)}
              >
                {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleCopy(mockSecret, 'secret')}
              >
                {copied === 'secret' ? (
                  <Check className="h-4 w-4 text-primary" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Use esta chave para validar a autenticidade dos eventos.
            </p>
          </div>

          {/* Events */}
          <div className="space-y-2">
            <Label>Eventos monitorados</Label>
            <div className="space-y-2 rounded-lg border border-border p-3">
              {checkoutEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`checkout-event-${event.id}`}
                    checked={selectedEvents.includes(event.id)}
                    onCheckedChange={() => toggleEvent(event.id)}
                  />
                  <Label
                    htmlFor={`checkout-event-${event.id}`}
                    className="cursor-pointer text-sm font-normal"
                  >
                    {event.label}
                    <span className="ml-2 text-xs text-muted-foreground font-mono">{event.id}</span>
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" size="sm" className="gap-2 mr-auto">
            <RefreshCw className="h-3.5 w-3.5" />
            Testar webhook
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button>Salvar configurações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
