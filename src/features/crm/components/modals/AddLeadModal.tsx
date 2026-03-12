import { useState, useMemo } from 'react'
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog'
import type { CrmField, Lead } from '../../types/crm.types'
import {
  isValidEmail,
  getInputProps,
  processInputValue,
  generateId,
} from '../../utils/crm.utils'

interface AddLeadModalProps {
  open: boolean
  onClose: () => void
  fields: CrmField[]
  firstStageId: string
  onSave: (lead: Lead) => void
}

export function AddLeadModal({ open, onClose, fields, firstStageId, onSave }: AddLeadModalProps) {
  const [nome, setNome] = useState('')
  const [valores, setValores] = useState<Record<string, string>>({})
  const [confirmSave, setConfirmSave] = useState(false)

  const sortedFields = useMemo(() => [...fields].sort((a, b) => a.ordem - b.ordem), [fields])

  const hasEmailErrors = useMemo(() => {
    return sortedFields.some(
      (f) => f.tipo === 'email' && valores[f.id] && !isValidEmail(valores[f.id])
    )
  }, [sortedFields, valores])

  const handleOpen = (isOpen: boolean) => {
    if (isOpen) {
      setNome('')
      setValores({})
    }
  }

  const handleFieldChange = (field: CrmField, raw: string) => {
    const processed = processInputValue(field, raw)
    setValores((prev) => ({ ...prev, [field.id]: processed }))
  }

  const canSave = nome.trim().length > 0 && !hasEmailErrors

  const handleSave = () => setConfirmSave(true)

  const confirmCreate = () => {
    const lead: Lead = {
      id: generateId('lead'),
      nome: nome.trim(),
      etapaId: firstStageId,
      valores,
    }
    onSave(lead)
    setConfirmSave(false)
    onClose()
    setNome('')
    setValores({})
  }

  const displayPhone = (field: CrmField, raw: string) => {
    if (!raw) return ''
    if (field.tipo === 'telefone') {
      const d = raw.slice(0, 11)
      if (d.length <= 2) return `(${d}`
      if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`
      return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
    }
    return raw
  }

  return (
    <>
      <Dialog open={open} onOpenChange={(o) => { handleOpen(o); if (!o) onClose() }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar lead</DialogTitle>
          </DialogHeader>

          <div className="max-h-[400px] space-y-4 overflow-y-auto pr-1">
            {/* Nome (obrigatório) */}
            <div className="space-y-1.5">
              <Label>
                Nome <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="Nome do lead"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            {/* Campos dinâmicos */}
            {sortedFields.map((field) => {
              const inputProps = getInputProps(field)
              const raw = valores[field.id] ?? ''
              const isEmailInvalid = field.tipo === 'email' && raw && !isValidEmail(raw)

              return (
                <div key={field.id} className="space-y-1.5">
                  <Label>{field.nome}</Label>
                  <Input
                    type={inputProps.type}
                    inputMode={inputProps.inputMode}
                    placeholder={inputProps.placeholder}
                    value={field.tipo === 'telefone' ? displayPhone(field, raw) : raw}
                    onChange={(e) => handleFieldChange(field, e.target.value)}
                    className={isEmailInvalid ? 'border-destructive focus:ring-destructive' : ''}
                  />
                  {isEmailInvalid && (
                    <p className="text-xs text-destructive">E-mail inválido</p>
                  )}
                </div>
              )
            })}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!canSave}>
              Salvar lead
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmSave} onOpenChange={setConfirmSave}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar adição</AlertDialogTitle>
            <AlertDialogDescription>
              Adicionar o lead <strong>&ldquo;{nome.trim()}&rdquo;</strong> ao funil?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCreate}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
