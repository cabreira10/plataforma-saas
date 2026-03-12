import { Globe, Phone, Star, MessageCircle } from 'lucide-react'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Badge } from '@/shared/components/ui/badge'
import type { ProspectLead } from '../types/leads-capture.types'

interface LeadResultCardProps {
  lead: ProspectLead
  selected: boolean
  onSelect: (id: string, checked: boolean) => void
}

export function LeadResultCard({ lead, selected, onSelect }: LeadResultCardProps) {
  return (
    <div
      className={`glass-card rounded-xl p-4 cursor-pointer transition-all duration-150 ${
        selected
          ? 'border-primary/50 bg-primary/5 ring-1 ring-primary/20'
          : 'hover:border-border/80'
      }`}
      onClick={() => onSelect(lead.id, !selected)}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={selected}
          onCheckedChange={(v) => onSelect(lead.id, !!v)}
          onClick={(e) => e.stopPropagation()}
          className="mt-0.5 shrink-0"
        />

        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-medium text-foreground truncate">{lead.nome}</p>
              <p className="text-xs text-muted-foreground truncate">
                {lead.categoria} · {lead.cidade}
              </p>
            </div>
            {lead.rating !== null && (
              <div className="flex items-center gap-1 shrink-0">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="text-xs font-medium text-amber-400">{lead.rating}</span>
                {lead.reviews !== null && (
                  <span className="text-xs text-muted-foreground">({lead.reviews})</span>
                )}
              </div>
            )}
          </div>

          <p className="text-xs text-muted-foreground truncate">{lead.endereco}</p>

          <div className="flex flex-wrap gap-1.5">
            {lead.whatsapp && (
              <Badge
                variant="secondary"
                className="gap-1 text-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              >
                <MessageCircle className="h-3 w-3" />
                WhatsApp
              </Badge>
            )}
            {lead.telefone && !lead.whatsapp && (
              <Badge variant="secondary" className="gap-1 text-xs">
                <Phone className="h-3 w-3" />
                {lead.telefone}
              </Badge>
            )}
            {lead.website && (
              <Badge
                variant="secondary"
                className="gap-1 text-xs bg-blue-500/10 text-blue-400 border-blue-500/20"
              >
                <Globe className="h-3 w-3" />
                Site
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
