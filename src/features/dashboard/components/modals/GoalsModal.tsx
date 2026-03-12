import { useState } from 'react'
import { Target, TrendingUp } from 'lucide-react'
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

interface GoalsModalProps {
  open: boolean
  onClose: () => void
}

export function GoalsModal({ open, onClose }: GoalsModalProps) {
  const [goals, setGoals] = useState({
    receitaMensal: '1000000',
    lucroMensal: '400000',
    novosLeads: '20',
    contratosAssinados: '5',
    ticketMedio: '500000',
  })

  const formatCurrency = (centavos: string) => {
    const num = parseInt(centavos || '0') / 100
    return num.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Definir metas mensais
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg bg-primary/5 border border-primary/20 px-3 py-2">
            <p className="text-xs text-muted-foreground">
              Configure suas metas para acompanhar o progresso no dashboard.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-green-400" />
              Meta de receita (R$)
            </Label>
            <Input
              inputMode="numeric"
              value={formatCurrency(goals.receitaMensal)}
              onChange={(e) =>
                setGoals((g) => ({ ...g, receitaMensal: e.target.value.replace(/\D/g, '') }))
              }
            />
          </div>

          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-primary" />
              Meta de lucro (R$)
            </Label>
            <Input
              inputMode="numeric"
              value={formatCurrency(goals.lucroMensal)}
              onChange={(e) =>
                setGoals((g) => ({ ...g, lucroMensal: e.target.value.replace(/\D/g, '') }))
              }
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Novos leads</Label>
              <Input
                inputMode="numeric"
                placeholder="0"
                value={goals.novosLeads}
                onChange={(e) =>
                  setGoals((g) => ({ ...g, novosLeads: e.target.value.replace(/\D/g, '') }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Contratos assinados</Label>
              <Input
                inputMode="numeric"
                placeholder="0"
                value={goals.contratosAssinados}
                onChange={(e) =>
                  setGoals((g) => ({ ...g, contratosAssinados: e.target.value.replace(/\D/g, '') }))
                }
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Ticket médio (R$)</Label>
            <Input
              inputMode="numeric"
              value={formatCurrency(goals.ticketMedio)}
              onChange={(e) =>
                setGoals((g) => ({ ...g, ticketMedio: e.target.value.replace(/\D/g, '') }))
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button>Salvar metas</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
