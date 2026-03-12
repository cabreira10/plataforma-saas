import { UserSearch, Download } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { EmptyState } from '@/shared/components/layout/EmptyState'
import { LeadResultCard } from './LeadResultCard'
import type { ProspectLead } from '../types/leads-capture.types'

interface ResultsListProps {
  leads: ProspectLead[]
  selectedIds: Set<string>
  allSelected: boolean
  someSelected: boolean
  onSelect: (id: string, checked: boolean) => void
  onSelectAll: (checked: boolean) => void
  onImport: () => void
}

export function ResultsList({
  leads,
  selectedIds,
  allSelected,
  someSelected,
  onSelect,
  onSelectAll,
  onImport,
}: ResultsListProps) {
  if (leads.length === 0) {
    return (
      <div className="glass-card rounded-xl p-6">
        <EmptyState
          icon={UserSearch}
          title="Nenhum resultado encontrado"
          description="Tente buscar com palavras-chave diferentes ou uma localização mais abrangente."
        />
      </div>
    )
  }

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={allSelected}
            onCheckedChange={(v) => onSelectAll(!!v)}
            aria-label="Selecionar todos"
          />
          <span className="text-sm text-muted-foreground">
            {someSelected
              ? `${selectedIds.size} selecionado${selectedIds.size !== 1 ? 's' : ''}`
              : `${leads.length} resultado${leads.length !== 1 ? 's' : ''} encontrado${leads.length !== 1 ? 's' : ''}`}
          </span>
        </div>

        {someSelected && (
          <Button size="sm" className="gap-2" onClick={onImport}>
            <Download className="h-4 w-4" />
            Importar para CRM ({selectedIds.size})
          </Button>
        )}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {leads.map((lead) => (
          <LeadResultCard
            key={lead.id}
            lead={lead}
            selected={selectedIds.has(lead.id)}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  )
}
