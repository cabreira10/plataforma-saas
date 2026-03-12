import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Label } from '@/shared/components/ui/label'
import { Input } from '@/shared/components/ui/input'
import { Download } from 'lucide-react'

const DEFAULT_STAGES = ['Novos Leads', 'Primeiro Contato', 'Em Negociação', 'Qualificados']

interface ImportLeadsModalProps {
  open: boolean
  onClose: () => void
  selectedCount: number
  onConfirm: (stageName: string) => void
}

export function ImportLeadsModal({
  open,
  onClose,
  selectedCount,
  onConfirm,
}: ImportLeadsModalProps) {
  const [selectedStage, setSelectedStage] = useState(DEFAULT_STAGES[0])
  const [customStage, setCustomStage] = useState('')
  const [useCustom, setUseCustom] = useState(false)

  const stageName = useCustom ? customStage.trim() : selectedStage
  const canConfirm = stageName.length > 0

  const handleClose = () => {
    setCustomStage('')
    setUseCustom(false)
    onClose()
  }

  const handleConfirm = () => {
    if (!canConfirm) return
    onConfirm(stageName)
    setCustomStage('')
    setUseCustom(false)
  }

  const plural = selectedCount !== 1

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Importar para CRM</DialogTitle>
          <DialogDescription>
            {selectedCount} lead{plural ? 's' : ''} ser{plural ? 'ão' : 'á'} importado
            {plural ? 's' : ''} para o funil de vendas.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Etapa do funil</Label>
            <div className="grid grid-cols-2 gap-2">
              {DEFAULT_STAGES.map((stage) => (
                <button
                  key={stage}
                  type="button"
                  onClick={() => {
                    setSelectedStage(stage)
                    setUseCustom(false)
                  }}
                  className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                    !useCustom && selectedStage === stage
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-card/40 text-muted-foreground hover:border-border/80 hover:text-foreground'
                  }`}
                >
                  {stage}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Ou informe outra etapa</Label>
            <Input
              placeholder="Nome da etapa..."
              value={customStage}
              onChange={(e) => {
                setCustomStage(e.target.value)
                setUseCustom(true)
              }}
              onFocus={() => setUseCustom(true)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={!canConfirm} className="gap-2">
            <Download className="h-4 w-4" />
            Importar {selectedCount} lead{plural ? 's' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
