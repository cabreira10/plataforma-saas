import { useState, useMemo } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/shared/components/ui/sheet'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Badge } from '@/shared/components/ui/badge'
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
import type { Lead, CrmField, Stage } from '../types/crm.types'
import {
  formatDisplayValue,
  isValidEmail,
  getInputProps,
  processInputValue,
} from '../utils/crm.utils'

interface LeadDetailSheetProps {
  lead: Lead | null
  fields: CrmField[]
  stages: Stage[]
  onClose: () => void
  onUpdate: (lead: Lead) => void
  onDelete: (leadId: string) => void
}

export function LeadDetailSheet({
  lead,
  fields,
  stages,
  onClose,
  onUpdate,
  onDelete,
}: LeadDetailSheetProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editNome, setEditNome] = useState('')
  const [editValores, setEditValores] = useState<Record<string, string>>({})
  const [confirmDelete, setConfirmDelete] = useState(false)

  const sortedFields = useMemo(() => [...fields].sort((a, b) => a.ordem - b.ordem), [fields])
  const etapa = stages.find((s) => s.id === lead?.etapaId)

  const hasEmailErrors = useMemo(() => {
    return sortedFields.some(
      (f) => f.tipo === 'email' && editValores[f.id] && !isValidEmail(editValores[f.id])
    )
  }, [sortedFields, editValores])

  const startEdit = () => {
    if (!lead) return
    setEditNome(lead.nome)
    setEditValores({ ...lead.valores })
    setIsEditing(true)
  }

  const cancelEdit = () => {
    setIsEditing(false)
  }

  const handleFieldChange = (field: CrmField, raw: string) => {
    const processed = processInputValue(field, raw)
    setEditValores((prev) => ({ ...prev, [field.id]: processed }))
  }

  const displayPhone = (raw: string) => {
    const d = raw.slice(0, 11)
    if (d.length <= 2) return `(${d}`
    if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
  }

  const saveEdit = () => {
    if (!lead || !editNome.trim() || hasEmailErrors) return
    onUpdate({ ...lead, nome: editNome.trim(), valores: editValores })
    setIsEditing(false)
  }

  const confirmDeleteLead = () => {
    if (!lead) return
    onDelete(lead.id)
    setConfirmDelete(false)
    onClose()
  }

  return (
    <>
      <Sheet open={!!lead} onOpenChange={(o) => { if (!o) { setIsEditing(false); onClose() } }}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="truncate">
              {isEditing ? 'Editar lead' : (lead?.nome ?? '')}
            </SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-5">
            {isEditing ? (
              <>
                {/* Edit nome */}
                <div className="space-y-1.5">
                  <Label>
                    Nome <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={editNome}
                    onChange={(e) => setEditNome(e.target.value)}
                    placeholder="Nome do lead"
                  />
                </div>

                {/* Edit campos */}
                {sortedFields.map((field) => {
                  const inputProps = getInputProps(field)
                  const raw = editValores[field.id] ?? ''
                  const isEmailInvalid = field.tipo === 'email' && raw && !isValidEmail(raw)

                  return (
                    <div key={field.id} className="space-y-1.5">
                      <Label>{field.nome}</Label>
                      <Input
                        type={inputProps.type}
                        inputMode={inputProps.inputMode}
                        placeholder={inputProps.placeholder}
                        value={field.tipo === 'telefone' ? displayPhone(raw) : raw}
                        onChange={(e) => handleFieldChange(field, e.target.value)}
                        className={isEmailInvalid ? 'border-destructive' : ''}
                      />
                      {isEmailInvalid && (
                        <p className="text-xs text-destructive">E-mail inválido</p>
                      )}
                    </div>
                  )
                })}
              </>
            ) : (
              <>
                {/* View mode */}
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Etapa atual</p>
                  <Badge variant="secondary">{etapa?.nome ?? '—'}</Badge>
                </div>

                {sortedFields.map((field) => (
                  <div key={field.id} className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">{field.nome}</p>
                    <p className="text-sm text-foreground">
                      {formatDisplayValue(field, lead?.valores[field.id] ?? '')}
                    </p>
                  </div>
                ))}
              </>
            )}
          </div>

          <SheetFooter className="mt-8">
            {isEditing ? (
              <div className="flex w-full gap-2">
                <Button variant="outline" onClick={cancelEdit} className="flex-1">
                  Cancelar
                </Button>
                <Button
                  onClick={saveEdit}
                  disabled={!editNome.trim() || hasEmailErrors}
                  className="flex-1"
                >
                  Salvar alterações
                </Button>
              </div>
            ) : (
              <div className="flex w-full gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setConfirmDelete(true)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={startEdit} className="flex-1 gap-2">
                  <Pencil className="h-4 w-4" />
                  Editar
                </Button>
              </div>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Excluir o lead <strong>&ldquo;{lead?.nome}&rdquo;</strong>? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteLead}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
