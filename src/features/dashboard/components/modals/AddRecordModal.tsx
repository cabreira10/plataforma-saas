import { useState } from 'react'
import { PlusCircle } from 'lucide-react'
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

interface AddRecordModalProps {
  open: boolean
  onClose: () => void
}

type RecordType = 'receita' | 'despesa' | 'comissao'
type StatusType = 'confirmado' | 'pendente'

const tipoOptions: { id: RecordType; label: string }[] = [
  { id: 'receita', label: 'Receita' },
  { id: 'despesa', label: 'Despesa' },
  { id: 'comissao', label: 'Comissão' },
]

const categorias: Record<RecordType, string[]> = {
  receita: ['Serviço', 'Projeto', 'Consultoria', 'Mensalidade', 'Outros'],
  despesa: ['Ferramentas', 'Marketing', 'Impostos', 'Equipamentos', 'Serviços', 'Outros'],
  comissao: ['Venda', 'Indicação', 'Parceria', 'Outros'],
}

const defaultForm = {
  descricao: '',
  valor: '',
  categoria: '',
  data: new Date().toISOString().split('T')[0],
}

export function AddRecordModal({ open, onClose }: AddRecordModalProps) {
  const [tipo, setTipo] = useState<RecordType>('receita')
  const [status, setStatus] = useState<StatusType>('confirmado')
  const [form, setForm] = useState(defaultForm)

  const canSave = form.descricao.trim() !== '' && form.valor !== ''

  function handleTipo(t: RecordType) {
    setTipo(t)
    setForm((f) => ({ ...f, categoria: '' }))
  }

  function handleClose() {
    setTipo('receita')
    setStatus('confirmado')
    setForm(defaultForm)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Novo registro</DialogTitle>
          <DialogDescription>Adicione uma receita, despesa ou comissão.</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-5">
          {/* TIPO */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Tipo
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {tipoOptions.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleTipo(id)}
                  className={cn(
                    'rounded-lg border py-2 text-sm font-medium transition-colors',
                    tipo === id
                      ? 'border-primary/50 bg-primary/10 text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/30 hover:text-foreground',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* DATA */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Data
            </Label>
            <Input
              type="date"
              value={form.data}
              onChange={(e) => setForm((f) => ({ ...f, data: e.target.value }))}
            />
          </div>

          {/* DESCRIÇÃO */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Descrição *
            </Label>
            <Input
              placeholder="Ex: Consulta dermatológica"
              value={form.descricao}
              onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))}
            />
          </div>

          {/* CATEGORIA */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Categoria
            </Label>
            <Select
              value={form.categoria}
              onValueChange={(v) => setForm((f) => ({ ...f, categoria: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecionar categoria" />
              </SelectTrigger>
              <SelectContent>
                {categorias[tipo].map((cat) => (
                  <SelectItem key={cat} value={cat.toLowerCase()}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* VALOR */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Valor (R$) *
            </Label>
            <Input
              placeholder="0,00"
              inputMode="numeric"
              value={form.valor}
              onChange={(e) =>
                setForm((f) => ({ ...f, valor: e.target.value.replace(/[^\d,]/g, '') }))
              }
            />
          </div>

          {/* STATUS */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Status
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {(['confirmado', 'pendente'] as StatusType[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={cn(
                    'rounded-lg border py-2 text-sm font-medium transition-colors',
                    status === s
                      ? 'border-primary/50 bg-primary/10 text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/30 hover:text-foreground',
                  )}
                >
                  {s === 'confirmado' ? 'Confirmado' : 'Pendente'}
                </button>
              ))}
            </div>
          </div>
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button disabled={!canSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
