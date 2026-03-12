import { useMemo, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import { Badge } from '@/shared/components/ui/badge'
import type { Stage, CrmField, Lead } from '../types/crm.types'
import { formatDisplayValue } from '../utils/crm.utils'

// ── Lead Card ──────────────────────────────────────────────────────────────

interface LeadCardProps {
  lead: Lead
  fields: CrmField[]
  onClick: (lead: Lead) => void
  isDragging?: boolean
}

function LeadCard({ lead, fields, onClick, isDragging }: LeadCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: lead.id })
  const kanbanField = fields.find((f) => f.visivelKanban)

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={() => onClick(lead)}
      className={`cursor-pointer rounded-lg border border-border/50 bg-card/60 px-3 py-2.5 text-sm transition-colors hover:bg-card/90 hover:border-primary/30 ${
        isDragging ? 'opacity-0' : ''
      }`}
    >
      <p className="font-medium text-foreground truncate">{lead.nome}</p>
      {kanbanField && lead.valores[kanbanField.id] && (
        <p className="mt-0.5 text-xs text-muted-foreground truncate">
          {formatDisplayValue(kanbanField, lead.valores[kanbanField.id])}
        </p>
      )}
    </div>
  )
}

function LeadCardOverlay({ lead, fields }: { lead: Lead; fields: CrmField[] }) {
  const kanbanField = fields.find((f) => f.visivelKanban)
  return (
    <div className="w-[260px] rotate-2 cursor-grabbing rounded-lg border border-primary/40 bg-card px-3 py-2.5 text-sm shadow-lg">
      <p className="font-medium text-foreground truncate">{lead.nome}</p>
      {kanbanField && lead.valores[kanbanField.id] && (
        <p className="mt-0.5 text-xs text-muted-foreground truncate">
          {formatDisplayValue(kanbanField, lead.valores[kanbanField.id])}
        </p>
      )}
    </div>
  )
}

// ── Kanban Column ──────────────────────────────────────────────────────────

interface KanbanColumnProps {
  stage: Stage
  leads: Lead[]
  fields: CrmField[]
  onLeadClick: (lead: Lead) => void
  activeLeadId: string | null
}

function KanbanColumn({ stage, leads, fields, onLeadClick, activeLeadId }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id })

  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-[400px] w-[280px] shrink-0 flex-col rounded-xl border transition-colors ${
        isOver ? 'border-primary/50 bg-primary/5' : 'border-border bg-card/30'
      }`}
    >
      <div className="flex items-center justify-between border-b border-border px-3 py-3">
        <p className="text-sm font-semibold text-foreground">{stage.nome}</p>
        <Badge variant="secondary" className="text-xs">
          {leads.length}
        </Badge>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto p-2">
        {leads.map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            fields={fields}
            onClick={onLeadClick}
            isDragging={activeLeadId === lead.id}
          />
        ))}
        {leads.length === 0 && (
          <div className="flex min-h-[80px] items-center justify-center">
            <p className="text-xs text-muted-foreground/40">Sem leads</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Kanban Board ───────────────────────────────────────────────────────────

interface KanbanBoardProps {
  stages: Stage[]
  leads: Lead[]
  fields: CrmField[]
  onLeadClick: (lead: Lead) => void
  onLeadMove: (leadId: string, newStageId: string) => void
}

export function KanbanBoard({ stages, leads, fields, onLeadClick, onLeadMove }: KanbanBoardProps) {
  const [activeLeadId, setActiveLeadId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const sortedStages = useMemo(() => [...stages].sort((a, b) => a.ordem - b.ordem), [stages])

  const leadsByStage = useMemo(() => {
    const map: Record<string, Lead[]> = {}
    sortedStages.forEach((s) => {
      map[s.id] = leads.filter((l) => l.etapaId === s.id)
    })
    return map
  }, [sortedStages, leads])

  const activeLead = useMemo(
    () => (activeLeadId ? leads.find((l) => l.id === activeLeadId) ?? null : null),
    [activeLeadId, leads]
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveLeadId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveLeadId(null)
    if (!over) return
    const leadId = active.id as string
    const newStageId = over.id as string
    const lead = leads.find((l) => l.id === leadId)
    if (lead && lead.etapaId !== newStageId) {
      onLeadMove(leadId, newStageId)
    }
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex h-full gap-4 overflow-x-auto p-6 pb-8">
        {sortedStages.map((stage) => (
          <KanbanColumn
            key={stage.id}
            stage={stage}
            leads={leadsByStage[stage.id] ?? []}
            fields={fields}
            onLeadClick={onLeadClick}
            activeLeadId={activeLeadId}
          />
        ))}
      </div>

      <DragOverlay>
        {activeLead ? <LeadCardOverlay lead={activeLead} fields={fields} /> : null}
      </DragOverlay>
    </DndContext>
  )
}
