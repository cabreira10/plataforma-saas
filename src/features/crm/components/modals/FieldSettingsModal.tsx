import { useState } from 'react'
import { Plus, Trash2, ChevronUp, ChevronDown, Eye, Pencil } from 'lucide-react'
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
import type { CrmField, TipoCampo, Moeda } from '../../types/crm.types'
import { generateId } from '../../utils/crm.utils'

interface FieldSettingsModalProps {
  open: boolean
  onClose: () => void
  fields: CrmField[]
  onSave: (fields: CrmField[]) => void
}

const tipoLabels: Record<TipoCampo, string> = {
  texto: 'Texto',
  email: 'E-mail',
  numero: 'Número',
  telefone: 'Telefone',
  valor: 'Valor monetário',
}

const moedaLabels: Record<Moeda, string> = {
  BRL: 'BRL — Real (R$)',
  USD: 'USD — Dólar (US$)',
  EUR: 'EUR — Euro (€)',
}

const defaultForm = (): Omit<CrmField, 'id' | 'ordem'> => ({
  nome: '',
  tipo: 'texto',
  moeda: 'BRL',
  visivelKanban: false,
})

export function FieldSettingsModal({ open, onClose, fields, onSave }: FieldSettingsModalProps) {
  const [temp, setTemp] = useState<CrmField[]>(() =>
    [...fields].sort((a, b) => a.ordem - b.ordem)
  )
  const [isAdding, setIsAdding] = useState(false)
  const [editing, setEditing] = useState<CrmField | null>(null)
  const [form, setForm] = useState(defaultForm())
  const [confirmRemove, setConfirmRemove] = useState<CrmField | null>(null)
  const [confirmSave, setConfirmSave] = useState(false)

  const handleOpen = (isOpen: boolean) => {
    if (isOpen) {
      setTemp([...fields].sort((a, b) => a.ordem - b.ordem))
      setIsAdding(false)
      setEditing(null)
      setForm(defaultForm())
    }
  }

  const startAdd = () => {
    setEditing(null)
    setForm(defaultForm())
    setIsAdding(true)
  }

  const startEdit = (field: CrmField) => {
    setEditing(field)
    setForm({ nome: field.nome, tipo: field.tipo, moeda: field.moeda ?? 'BRL', visivelKanban: field.visivelKanban })
    setIsAdding(true)
  }

  const cancelForm = () => {
    setIsAdding(false)
    setEditing(null)
    setForm(defaultForm())
  }

  const saveForm = () => {
    if (!form.nome.trim()) return
    if (editing) {
      setTemp((prev) =>
        prev.map((f) =>
          f.id === editing.id
            ? { ...f, ...form, nome: form.nome.trim(), moeda: form.tipo === 'valor' ? form.moeda : undefined }
            : f
        )
      )
    } else {
      const novo: CrmField = {
        ...form,
        id: generateId('campo'),
        nome: form.nome.trim(),
        moeda: form.tipo === 'valor' ? form.moeda : undefined,
        ordem: temp.length,
      }
      setTemp((prev) => [...prev, novo])
    }
    cancelForm()
  }

  const moveUp = (idx: number) => {
    if (idx === 0) return
    setTemp((prev) => {
      const arr = [...prev]
      ;[arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]]
      return arr.map((f, i) => ({ ...f, ordem: i }))
    })
  }

  const moveDown = (idx: number) => {
    if (idx === temp.length - 1) return
    setTemp((prev) => {
      const arr = [...prev]
      ;[arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]]
      return arr.map((f, i) => ({ ...f, ordem: i }))
    })
  }

  const handleSave = () => setConfirmSave(true)
  const confirmSaveFields = () => {
    onSave(temp)
    setConfirmSave(false)
    onClose()
  }

  return (
    <>
      <Dialog open={open} onOpenChange={(o) => { handleOpen(o); if (!o) onClose() }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Configurar campos</DialogTitle>
          </DialogHeader>

          {isAdding ? (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Nome do campo</Label>
                <Input
                  placeholder="Ex: Empresa, Orçamento..."
                  value={form.nome}
                  onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Tipo</Label>
                <Select
                  value={form.tipo}
                  onValueChange={(v) => setForm((f) => ({ ...f, tipo: v as TipoCampo }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(tipoLabels) as TipoCampo[]).map((t) => (
                      <SelectItem key={t} value={t}>
                        {tipoLabels[t]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {form.tipo === 'valor' && (
                <div className="space-y-1.5">
                  <Label>Moeda</Label>
                  <Select
                    value={form.moeda ?? 'BRL'}
                    onValueChange={(v) => setForm((f) => ({ ...f, moeda: v as Moeda }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(moedaLabels) as Moeda[]).map((m) => (
                        <SelectItem key={m} value={m}>
                          {moedaLabels[m]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Checkbox
                  id="visivel-kanban"
                  checked={form.visivelKanban}
                  onCheckedChange={(c) => setForm((f) => ({ ...f, visivelKanban: !!c }))}
                />
                <Label htmlFor="visivel-kanban" className="cursor-pointer">
                  Visível no Kanban
                </Label>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={cancelForm} className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={saveForm} disabled={!form.nome.trim()} className="flex-1">
                  {editing ? 'Atualizar campo' : 'Adicionar campo'}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <Button variant="outline" size="sm" className="gap-2 self-start" onClick={startAdd}>
                <Plus className="h-4 w-4" />
                Novo campo
              </Button>

              <div className="max-h-[300px] space-y-1 overflow-y-auto pr-1">
                {temp.length === 0 && (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    Nenhum campo configurado.
                  </p>
                )}
                {temp.map((field, idx) => (
                  <div
                    key={field.id}
                    className="flex items-center gap-2 rounded-lg border border-border bg-card/50 px-3 py-2"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{field.nome}</p>
                      <p className="text-xs text-muted-foreground">
                        {tipoLabels[field.tipo]}
                        {field.tipo === 'valor' && field.moeda ? ` · ${field.moeda}` : ''}
                      </p>
                    </div>
                    {field.visivelKanban && (
                      <Eye className="h-3.5 w-3.5 shrink-0 text-primary" />
                    )}
                    <div className="flex shrink-0 gap-0.5">
                      <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => moveUp(idx)} disabled={idx === 0}>
                        <ChevronUp className="h-3 w-3" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => moveDown(idx)} disabled={idx === temp.length - 1}>
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => startEdit(field)}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 text-destructive hover:text-destructive"
                        onClick={() => setConfirmRemove(field)}
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
                <Button onClick={handleSave}>Salvar campos</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirm remove */}
      <AlertDialog open={!!confirmRemove} onOpenChange={(o) => !o && setConfirmRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar remoção</AlertDialogTitle>
            <AlertDialogDescription>
              Remover o campo <strong>&ldquo;{confirmRemove?.nome}&rdquo;</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setTemp((prev) => prev.filter((f) => f.id !== confirmRemove?.id).map((f, i) => ({ ...f, ordem: i })))
                setConfirmRemove(null)
              }}
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
            <AlertDialogDescription>Salvar as alterações nos campos?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSaveFields}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
