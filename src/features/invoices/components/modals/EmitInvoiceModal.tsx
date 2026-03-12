import { useState } from 'react'
import { Receipt, Building2, Hash } from 'lucide-react'
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
import { Badge } from '@/shared/components/ui/badge'

interface EmitInvoiceModalProps {
  open: boolean
  onClose: () => void
}

type InvoiceType = 'nfe' | 'nfse'

export function EmitInvoiceModal({ open, onClose }: EmitInvoiceModalProps) {
  const [tipo, setTipo] = useState<InvoiceType>('nfse')
  const [form, setForm] = useState({
    tomador: '',
    cnpjCpf: '',
    valor: '',
    descricao: '',
    aliquota: '5',
    natureza: '',
  })

  const canEmit = form.tomador.trim() && form.valor && form.descricao.trim()

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            Emitir nota fiscal
          </DialogTitle>
        </DialogHeader>

        {/* Tipo */}
        <div className="flex gap-2">
          {(['nfe', 'nfse'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTipo(t)}
              className={`flex-1 rounded-lg border py-2 text-sm font-medium transition-colors ${
                tipo === t
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:border-primary/50'
              }`}
            >
              {t === 'nfe' ? 'NF-e (Produto)' : 'NFS-e (Serviço)'}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" /> Tomador / Cliente
            </Label>
            <Input
              placeholder="Nome ou razão social"
              value={form.tomador}
              onChange={(e) => setForm((f) => ({ ...f, tomador: e.target.value }))}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5">
                <Hash className="h-3.5 w-3.5" /> CPF / CNPJ
              </Label>
              <Input
                placeholder="000.000.000-00"
                value={form.cnpjCpf}
                onChange={(e) => setForm((f) => ({ ...f, cnpjCpf: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Valor (R$) *</Label>
              <Input
                placeholder="0,00"
                inputMode="numeric"
                value={form.valor}
                onChange={(e) => setForm((f) => ({ ...f, valor: e.target.value.replace(/\D/g, '') }))}
              />
            </div>
          </div>

          {tipo === 'nfse' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Natureza da operação</Label>
                <Select
                  value={form.natureza}
                  onValueChange={(v) => setForm((f) => ({ ...f, natureza: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Tributação no município</SelectItem>
                    <SelectItem value="2">Tributação fora do município</SelectItem>
                    <SelectItem value="3">Isenção</SelectItem>
                    <SelectItem value="4">Imune</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Alíquota ISS (%)</Label>
                <Input
                  placeholder="5"
                  value={form.aliquota}
                  onChange={(e) => setForm((f) => ({ ...f, aliquota: e.target.value }))}
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <Label>Descrição dos serviços *</Label>
            <textarea
              className="h-20 w-full resize-none rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Descrição detalhada..."
              value={form.descricao}
              onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))}
            />
          </div>
        </div>

        {canEmit && (
          <div className="flex items-center justify-between rounded-lg bg-primary/5 border border-primary/20 px-3 py-2">
            <span className="text-xs text-muted-foreground">Total a emitir</span>
            <Badge variant="default" className="text-xs">
              R$ {(parseInt(form.valor) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Badge>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button disabled={!canEmit}>
            <Receipt className="mr-2 h-4 w-4" />
            Emitir {tipo === 'nfe' ? 'NF-e' : 'NFS-e'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
