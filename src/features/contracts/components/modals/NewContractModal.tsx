import { useState } from 'react'
import { FileText, User, Calendar, DollarSign } from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'

interface NewContractModalProps {
  open: boolean
  onClose: () => void
}

export function NewContractModal({ open, onClose }: NewContractModalProps) {
  const [form, setForm] = useState({
    titulo: '',
    cliente: '',
    valor: '',
    dataInicio: '',
    dataVencimento: '',
    template: '',
    descricao: '',
  })

  const canSave = form.titulo.trim() && form.cliente.trim()

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Novo contrato
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Título do contrato *</Label>
              <Input
                placeholder="Ex: Prestação de serviços"
                value={form.titulo}
                onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Template</Label>
              <Select
                value={form.template}
                onValueChange={(v) => setForm((f) => ({ ...f, template: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="servicos">Prestação de Serviços</SelectItem>
                  <SelectItem value="consultoria">Consultoria</SelectItem>
                  <SelectItem value="desenvolvimento">Desenvolvimento</SelectItem>
                  <SelectItem value="manutencao">Manutenção</SelectItem>
                  <SelectItem value="em-branco">Em branco</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" /> Cliente *
            </Label>
            <Input
              placeholder="Nome do cliente ou empresa"
              value={form.cliente}
              onChange={(e) => setForm((f) => ({ ...f, cliente: e.target.value }))}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5" /> Valor (R$)
              </Label>
              <Input
                placeholder="0,00"
                inputMode="numeric"
                value={form.valor}
                onChange={(e) =>
                  setForm((f) => ({ ...f, valor: e.target.value.replace(/\D/g, '') }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" /> Vencimento
              </Label>
              <Input
                type="date"
                value={form.dataVencimento}
                onChange={(e) => setForm((f) => ({ ...f, dataVencimento: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Descrição / Escopo</Label>
            <textarea
              className="h-24 w-full resize-none rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Descreva o escopo dos serviços..."
              value={form.descricao}
              onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button disabled={!canSave}>Criar contrato</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
