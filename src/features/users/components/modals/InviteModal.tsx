import { useState } from 'react'
import { UserPlus, Mail, Shield } from 'lucide-react'
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

interface InviteModalProps {
  open: boolean
  onClose: () => void
}

const roleDescriptions: Record<string, string> = {
  admin: 'Pode gerenciar membros, configurações e todos os módulos',
  member: 'Acesso aos módulos permitidos pelo administrador',
}

export function InviteModal({ open, onClose }: InviteModalProps) {
  const [emails, setEmails] = useState<string[]>([])
  const [emailInput, setEmailInput] = useState('')
  const [role, setRole] = useState('member')
  const [error, setError] = useState('')

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

  const addEmail = () => {
    const trimmed = emailInput.trim()
    if (!trimmed) return
    if (!isValidEmail(trimmed)) {
      setError('E-mail inválido')
      return
    }
    if (emails.includes(trimmed)) {
      setError('E-mail já adicionado')
      return
    }
    setEmails((prev) => [...prev, trimmed])
    setEmailInput('')
    setError('')
  }

  const removeEmail = (email: string) => {
    setEmails((prev) => prev.filter((e) => e !== email))
  }

  const canSend = emails.length > 0

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { setEmails([]); setEmailInput(''); setError(''); onClose() } }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Convidar membros
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Email input */}
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" /> E-mail
            </Label>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="email@exemplo.com"
                value={emailInput}
                onChange={(e) => { setEmailInput(e.target.value); setError('') }}
                onKeyDown={(e) => e.key === 'Enter' && addEmail()}
                className={error ? 'border-destructive' : ''}
              />
              <Button variant="outline" onClick={addEmail} disabled={!emailInput.trim()}>
                Adicionar
              </Button>
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>

          {/* Email list */}
          {emails.length > 0 && (
            <div className="space-y-1.5">
              <Label>Convidados ({emails.length})</Label>
              <div className="space-y-1">
                {emails.map((email) => (
                  <div
                    key={email}
                    className="flex items-center justify-between rounded-lg bg-card/50 border border-border px-3 py-1.5"
                  >
                    <span className="text-sm text-foreground">{email}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 px-2 text-muted-foreground hover:text-destructive"
                      onClick={() => removeEmail(email)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Role */}
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5" /> Função
            </Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="member">Membro</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">{roleDescriptions[role]}</p>
          </div>

          {/* Summary */}
          {canSend && (
            <div className="flex items-center gap-2 rounded-lg bg-primary/5 border border-primary/20 px-3 py-2">
              <Mail className="h-4 w-4 text-primary" />
              <p className="text-sm text-muted-foreground">
                Enviando {emails.length} convite{emails.length > 1 ? 's' : ''} como{' '}
                <Badge variant="secondary" className="text-xs">{role === 'admin' ? 'Administrador' : 'Membro'}</Badge>
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button disabled={!canSend} className="gap-2">
            <Mail className="h-4 w-4" />
            Enviar convites
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
