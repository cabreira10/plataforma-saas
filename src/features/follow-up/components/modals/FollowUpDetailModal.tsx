import { useState } from 'react'
import { MessageCircle, Clock, CheckCircle2, User, Send } from 'lucide-react'
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
import { Badge } from '@/shared/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'

interface FollowUpDetailModalProps {
  open: boolean
  onClose: () => void
}

const mockFollowUp = {
  id: '1',
  cliente: 'João Silva',
  titulo: 'Proposta de desenvolvimento',
  status: 'pendente',
  ultimoContato: '2024-01-15',
  proximoContato: '2024-01-22',
  canal: 'whatsapp',
  historico: [
    { data: '2024-01-10', mensagem: 'Primeiro contato realizado. Cliente demonstrou interesse.', autor: 'Você' },
    { data: '2024-01-15', mensagem: 'Enviei a proposta por e-mail. Aguardando retorno.', autor: 'Você' },
  ],
}

const statusColors: Record<string, 'default' | 'success' | 'warning' | 'destructive' | 'secondary'> = {
  pendente: 'warning',
  em_andamento: 'default',
  concluido: 'success',
  perdido: 'destructive',
}

const statusLabels: Record<string, string> = {
  pendente: 'Pendente',
  em_andamento: 'Em andamento',
  concluido: 'Concluído',
  perdido: 'Perdido',
}

export function FollowUpDetailModal({ open, onClose }: FollowUpDetailModalProps) {
  const [nota, setNota] = useState('')
  const [status, setStatus] = useState(mockFollowUp.status)
  const [proximoContato, setProximoContato] = useState(mockFollowUp.proximoContato)

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            Detalhe do Follow-up
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Info */}
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold text-foreground">{mockFollowUp.titulo}</p>
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <User className="h-3.5 w-3.5" />
                {mockFollowUp.cliente}
              </p>
            </div>
            <Badge variant={statusColors[status]}>{statusLabels[status]}</Badge>
          </div>

          {/* Status + Próximo contato */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="em_andamento">Em andamento</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                  <SelectItem value="perdido">Perdido</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> Próximo contato
              </Label>
              <Input
                type="date"
                value={proximoContato}
                onChange={(e) => setProximoContato(e.target.value)}
              />
            </div>
          </div>

          {/* Histórico */}
          <div className="space-y-2">
            <Label>Histórico</Label>
            <div className="max-h-[160px] space-y-2 overflow-y-auto rounded-lg border border-border p-3">
              {mockFollowUp.historico.map((h, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary" />
                    <span className="text-xs font-medium text-foreground">{h.autor}</span>
                    <span className="text-xs text-muted-foreground">{h.data}</span>
                  </div>
                  <p className="pl-5 text-xs text-muted-foreground">{h.mensagem}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Nova nota */}
          <div className="space-y-1.5">
            <Label>Adicionar nota</Label>
            <div className="flex gap-2">
              <Input
                placeholder="O que aconteceu neste contato?"
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                className="flex-1"
              />
              <Button size="icon" variant="outline" disabled={!nota.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button>Salvar alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
