import { useState } from 'react'
import { Plus, Trash2, GripVertical, ChevronUp, ChevronDown } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog'
import type { Stage } from '../../types/crm.types'
import { generateId } from '../../utils/crm.utils'

interface StageSettingsModalProps {
  open: boolean
  onClose: () => void
  stages: Stage[]
  onSave: (stages: Stage[]) => void
}

export function StageSettingsModal({ open, onClose, stages, onSave }: StageSettingsModalProps) {
  const [temp, setTemp] = useState<Stage[]>(() =>
    [...stages].sort((a, b) => a.ordem - b.ordem)
  )
  const [newName, setNewName] = useState('')
  const [confirmRemove, setConfirmRemove] = useState<Stage | null>(null)
  const [confirmSave, setConfirmSave] = useState(false)

  const handleOpen = (isOpen: boolean) => {
    if (isOpen) {
      setTemp([...stages].sort((a, b) => a.ordem - b.ordem))
      setNewName('')
    }
  }

  const addStage = () => {
    const name = newName.trim()
    if (!name) return
    const novo: Stage = {
      id: generateId('etapa'),
      nome: name,
      ordem: temp.length,
    }
    setTemp((prev) => [...prev, novo])
    setNewName('')
  }

  const rename = (id: string, nome: string) => {
    setTemp((prev) => prev.map((s) => (s.id === id ? { ...s, nome } : s)))
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    setTemp((prev) => {
      const arr = [...prev]
      ;[arr[index - 1], arr[index]] = [arr[index], arr[index - 1]]
      return arr.map((s, i) => ({ ...s, ordem: i }))
    })
  }

  const moveDown = (index: number) => {
    if (index === temp.length - 1) return
    setTemp((prev) => {
      const arr = [...prev]
      ;[arr[index], arr[index + 1]] = [arr[index + 1], arr[index]]
      return arr.map((s, i) => ({ ...s, ordem: i }))
    })
  }

  const removeStage = (stage: Stage) => setConfirmRemove(stage)
  const confirmRemoveStage = () => {
    if (!confirmRemove) return
    setTemp((prev) =>
      prev
        .filter((s) => s.id !== confirmRemove.id)
        .map((s, i) => ({ ...s, ordem: i }))
    )
    setConfirmRemove(null)
  }

  const handleSave = () => setConfirmSave(true)
  const confirmSaveStages = () => {
    onSave(temp)
    setConfirmSave(false)
    onClose()
  }

  return (
    <>
      <Dialog open={open} onOpenChange={(o) => { handleOpen(o); if (!o) onClose() }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Configurar etapas</DialogTitle>
          </DialogHeader>

          {/* Add new */}
          <div className="flex gap-2">
            <Input
              placeholder="Nome da etapa..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addStage()}
              className="flex-1"
            />
            <Button size="icon" variant="outline" onClick={addStage} disabled={!newName.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* List */}
          <div className="max-h-[300px] space-y-1 overflow-y-auto pr-1">
            {temp.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Nenhuma etapa. Adicione uma acima.
              </p>
            )}
            {temp.map((stage, idx) => (
              <div
                key={stage.id}
                className="flex items-center gap-2 rounded-lg border border-border bg-card/50 px-3 py-2"
              >
                <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground" />
                <Input
                  value={stage.nome}
                  onChange={(e) => rename(stage.id, e.target.value)}
                  className="h-7 flex-1 border-0 bg-transparent p-0 text-sm focus:ring-0 focus-visible:ring-0"
                />
                <div className="flex shrink-0 gap-0.5">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => moveUp(idx)}
                    disabled={idx === 0}
                  >
                    <ChevronUp className="h-3 w-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => moveDown(idx)}
                    disabled={idx === temp.length - 1}
                  >
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 text-destructive hover:text-destructive"
                    onClick={() => removeStage(stage)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={temp.length === 0}>
              Salvar etapas
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm remove stage */}
      <AlertDialog open={!!confirmRemove} onOpenChange={(o) => !o && setConfirmRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar remoção</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover a etapa{' '}
              <strong>&ldquo;{confirmRemove?.nome}&rdquo;</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRemoveStage}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirm save */}
      <AlertDialog open={confirmSave} onOpenChange={setConfirmSave}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar alterações</AlertDialogTitle>
            <AlertDialogDescription>
              Salvar as alterações nas etapas do funil?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSaveStages}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
