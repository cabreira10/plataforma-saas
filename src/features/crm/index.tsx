import { useState, useMemo } from 'react'
import { Plus, Settings, LayoutGrid } from 'lucide-react'
import { motion } from 'framer-motion'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { EmptyState } from '@/shared/components/layout/EmptyState'
import { Button } from '@/shared/components/ui/button'
import { staggerContainer, staggerItem } from '@/shared/lib/motion'
import { KanbanBoard } from './components/KanbanBoard'
import { StageSettingsModal } from './components/modals/StageSettingsModal'
import { FieldSettingsModal } from './components/modals/FieldSettingsModal'
import { AddLeadModal } from './components/modals/AddLeadModal'
import { LeadDetailSheet } from './components/LeadDetailSheet'
import type { Stage, CrmField, Lead } from './types/crm.types'

export default function CrmPage() {
  // ── State ──────────────────────────────────────────────────────────────
  const [stages, setStages] = useState<Stage[]>([])
  const [fields, setFields] = useState<CrmField[]>([])
  const [leads, setLeads] = useState<Lead[]>([])

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [showStageModal, setShowStageModal] = useState(false)
  const [showFieldModal, setShowFieldModal] = useState(false)
  const [showAddLead, setShowAddLead] = useState(false)

  // ── Derived ────────────────────────────────────────────────────────────
  const sortedStages = useMemo(() => [...stages].sort((a, b) => a.ordem - b.ordem), [stages])
  const sortedFields = useMemo(() => [...fields].sort((a, b) => a.ordem - b.ordem), [fields])
  const isEmpty = stages.length === 0

  // ── Handlers ───────────────────────────────────────────────────────────
  const handleSaveStages = (newStages: Stage[]) => setStages(newStages)
  const handleSaveFields = (newFields: CrmField[]) => setFields(newFields)

  const handleAddLead = (lead: Lead) => {
    setLeads((prev) => [...prev, lead])
  }

  const handleUpdateLead = (updated: Lead) => {
    setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)))
    setSelectedLead(updated)
  }

  const handleDeleteLead = (leadId: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== leadId))
    setSelectedLead(null)
  }

  const handleLeadMove = (leadId: string, newStageId: string) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, etapaId: newStageId } : l))
    )
  }

  const handleLeadClick = (lead: Lead) => setSelectedLead(lead)

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border p-6">
        <PageHeader
          title="CRM"
          description="Gerencie seus leads com um funil de vendas personalizado"
          actions={
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="gap-2"
                onClick={() => setShowStageModal(true)}
              >
                <Settings className="h-4 w-4" />
                Etapas
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-2"
                onClick={() => setShowFieldModal(true)}
              >
                <LayoutGrid className="h-4 w-4" />
                Campos
              </Button>
              {!isEmpty && (
                <Button
                  size="sm"
                  className="gap-2"
                  onClick={() => setShowAddLead(true)}
                  disabled={fields.length === 0}
                >
                  <Plus className="h-4 w-4" />
                  Adicionar lead
                </Button>
              )}
            </div>
          }
        />
      </div>

      {/* Body */}
      {isEmpty ? (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="flex flex-1 items-center justify-center"
        >
          <motion.div variants={staggerItem}>
            <EmptyState
              title="Nenhuma etapa configurada"
              description="Configure as etapas do seu funil de vendas para começar a gerenciar seus leads."
              action={
                <div className="flex gap-3">
                  <Button variant="outline" className="gap-2" onClick={() => setShowStageModal(true)}>
                    <Settings className="h-4 w-4" />
                    Configurar etapas
                  </Button>
                  <Button variant="outline" className="gap-2" onClick={() => setShowFieldModal(true)}>
                    <LayoutGrid className="h-4 w-4" />
                    Configurar campos
                  </Button>
                </div>
              }
            />
          </motion.div>
        </motion.div>
      ) : (
        <div className="flex-1 overflow-hidden">
          <KanbanBoard
            stages={sortedStages}
            leads={leads}
            fields={sortedFields}
            onLeadClick={handleLeadClick}
            onLeadMove={handleLeadMove}
          />
        </div>
      )}

      {/* Modals */}
      <StageSettingsModal
        open={showStageModal}
        onClose={() => setShowStageModal(false)}
        stages={stages}
        onSave={handleSaveStages}
      />

      <FieldSettingsModal
        open={showFieldModal}
        onClose={() => setShowFieldModal(false)}
        fields={fields}
        onSave={handleSaveFields}
      />

      {sortedStages.length > 0 && (
        <AddLeadModal
          open={showAddLead}
          onClose={() => setShowAddLead(false)}
          fields={sortedFields}
          firstStageId={sortedStages[0].id}
          onSave={handleAddLead}
        />
      )}

      <LeadDetailSheet
        lead={selectedLead}
        fields={sortedFields}
        stages={stages}
        onClose={() => setSelectedLead(null)}
        onUpdate={handleUpdateLead}
        onDelete={handleDeleteLead}
      />
    </div>
  )
}
