import { useState } from 'react'
import { MessageSquarePlus, MessageCircle, Mail, Phone, Hash } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogBody,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { cn } from '@/shared/lib/utils'

export interface FollowUpCardData {
  id: string
  cliente: string
  titulo: string
  coluna: string
  canal: Canal
  proximoContato: string
  notas: string
}

interface AddFollowUpModalProps {
  open: boolean
  onClose: () => void
  onSave: (data: Omit<FollowUpCardData, 'id'>) => void
  defaultColumn?: string
}

type Canal = 'whatsapp' | 'email' | 'telefone' | 'outro'

const canalOptions: { id: Canal; label: string; icon: React.ElementType }[] = [
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
  { id: 'email', label: 'E-mail', icon: Mail },
  { id: 'telefone', label: 'Telefone', icon: Phone },
  { id: 'outro', label: 'Outro', icon: Hash },
]

const colunas = [
  { id: 'new', label: 'Novo' },
  { id: 'contacted', label: 'Contactado' },
  { id: 'negotiating', label: 'Negociando' },
  { id: 'won', label: 'Ganho' },
  { id: 'lost', label: 'Perdido' },
]

const defaultForm = {
  cliente: '',
  titulo: '',
  canal: 'whatsapp' as Canal,
  proximoContato: '',
  notas: '',
}

export function AddFollowUpModal({
  open,
  onClose,
  onSave,
  defaultColumn = 'new',
}: AddFollowUpModalProps) {
  const [coluna, setColuna] = useState(defaultColumn)
  const [form, setForm] = useState(defaultForm)

  const canSave = form.cliente.trim() !== '' && form.titulo.trim() !== ''

  function handleClose() {
    setForm(defaultForm)
    setColuna(defaultColumn)
    onClose()
  }

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) handleClose()
  }

  function handleSave() {
    if (!canSave) return
    onSave({ ...form, coluna })
    handleClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquarePlus className="h-5 w-5 text-primary" />
            Novo Follow-up
          </DialogTitle>
          <DialogDescription>
            Adicione um lead ao seu pipeline de acompanhamento.
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-5">
          {/* Cliente */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Cliente *
            </Label>
            <Input
              placeholder="Nome do cliente ou empresa"
              value={form.cliente}
              onChange={(e) => setForm((f) => ({ ...f, cliente: e.target.value }))}
            />
          </div>

          {/* Título */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Título *
            </Label>
            <Input
              placeholder="Ex: Proposta de desenvolvimento web"
              value={form.titulo}
              onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
            />
          </div>

          {/* Canal */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Canal de contato
            </Label>
            <div className="grid grid-cols-4 gap-2">
              {canalOptions.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, canal: id }))}
                  className={cn(
                    'flex flex-col items-center gap-1.5 rounded-lg border py-3 text-xs font-medium transition-colors',
                    form.canal === id
                      ? 'border-primary/50 bg-primary/10 text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/30 hover:text-foreground',
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Coluna + Próximo contato */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Coluna
              </Label>
              <Select value={coluna} onValueChange={setColuna}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colunas.map((col) => (
                    <SelectItem key={col.id} value={col.id}>
                      {col.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Próximo contato
              </Label>
              <Input
                type="date"
                value={form.proximoContato}
                onChange={(e) => setForm((f) => ({ ...f, proximoContato: e.target.value }))}
              />
            </div>
          </div>

          {/* Notas */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Notas{' '}
              <span className="normal-case font-normal text-muted-foreground/60">(opcional)</span>
            </Label>
            <textarea
              placeholder="Observações iniciais sobre este lead..."
              value={form.notas}
              onChange={(e) => setForm((f) => ({ ...f, notas: e.target.value }))}
              rows={3}
              className={cn(
                'flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm',
                'placeholder:text-muted-foreground/50 focus-visible:outline-none',
                'focus-visible:ring-1 focus-visible:ring-ring resize-none',
              )}
            />
          </div>
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button disabled={!canSave} onClick={handleSave}>
            Adicionar card
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
