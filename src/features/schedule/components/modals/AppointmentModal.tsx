import { useState } from 'react'
import { CalendarDays, Clock, User, MapPin, Bell } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Checkbox } from '@/shared/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'

interface AppointmentModalProps {
  open: boolean
  onClose: () => void
  defaultDate?: string
}

export function AppointmentModal({ open, onClose, defaultDate }: AppointmentModalProps) {
  const [form, setForm] = useState({
    titulo: '',
    cliente: '',
    data: defaultDate ?? '',
    horaInicio: '09:00',
    horaFim: '10:00',
    local: '',
    tipo: 'reuniao',
    lembrete: true,
    notas: '',
  })

  const canSave = form.titulo.trim() && form.data && form.horaInicio

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            Novo agendamento
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Título *</Label>
            <Input
              placeholder="Ex: Reunião de briefing"
              value={form.titulo}
              onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Tipo</Label>
            <Select
              value={form.tipo}
              onValueChange={(v) => setForm((f) => ({ ...f, tipo: v }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reuniao">Reunião</SelectItem>
                <SelectItem value="ligacao">Ligação</SelectItem>
                <SelectItem value="entrega">Entrega</SelectItem>
                <SelectItem value="prazo">Prazo</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" /> Cliente (opcional)
            </Label>
            <Input
              placeholder="Nome do cliente"
              value={form.cliente}
              onChange={(e) => setForm((f) => ({ ...f, cliente: e.target.value }))}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5 sm:col-span-1">
              <Label className="flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" /> Data *
              </Label>
              <Input
                type="date"
                value={form.data}
                onChange={(e) => setForm((f) => ({ ...f, data: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> Início
              </Label>
              <Input
                type="time"
                value={form.horaInicio}
                onChange={(e) => setForm((f) => ({ ...f, horaInicio: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Fim</Label>
              <Input
                type="time"
                value={form.horaFim}
                onChange={(e) => setForm((f) => ({ ...f, horaFim: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" /> Local / Link
            </Label>
            <Input
              placeholder="Presencial ou link da reunião"
              value={form.local}
              onChange={(e) => setForm((f) => ({ ...f, local: e.target.value }))}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Notas</Label>
            <textarea
              className="h-16 w-full resize-none rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Observações..."
              value={form.notas}
              onChange={(e) => setForm((f) => ({ ...f, notas: e.target.value }))}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="lembrete"
              checked={form.lembrete}
              onCheckedChange={(c) => setForm((f) => ({ ...f, lembrete: !!c }))}
            />
            <Label htmlFor="lembrete" className="flex cursor-pointer items-center gap-1.5">
              <Bell className="h-3.5 w-3.5" /> Ativar lembrete
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button disabled={!canSave}>Salvar agendamento</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
