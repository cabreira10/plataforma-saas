import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, UserSearch } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { EmptyState } from '@/shared/components/layout/EmptyState'
import { staggerContainer, staggerItem } from '@/shared/lib/motion'
import { SearchForm } from './components/SearchForm'
import { ResultsList } from './components/ResultsList'
import { ImportLeadsModal } from './components/modals/ImportLeadsModal'
import type { ProspectLead } from './types/leads-capture.types'

const PLAN_LIMIT = { used: 12, total: 100 }

const PREFIXES = ['Studio', 'Agência', 'Consultoria', 'Empresa', 'Grupo', 'Centro', 'Ateliê', 'Escritório']
const SUFFIXES = ['Digital', 'Criativa', 'Plus', 'Expert', 'Pro', 'Prime', 'Soluções', 'Serviços']
const STREETS = ['Rua das Flores', 'Av. Paulista', 'Rua Augusta', 'Alameda Dom Pedro', 'Rua XV de Novembro', 'Av. Brasil', 'Rua Consolação', 'Rua da Liberdade']

function generateMockLeads(nicho: string, cidade: string): ProspectLead[] {
  return Array.from({ length: 8 }, (_, i) => {
    const hasPhone = i % 3 !== 0
    const hasWhatsapp = i % 2 === 0
    const phone = hasPhone ? `(11) 9${String(8000 + i * 13).padStart(4, '0')}-${String(4000 + i * 7).padStart(4, '0')}` : null

    return {
      id: `lead-${Date.now()}-${i}`,
      nome: `${PREFIXES[i % PREFIXES.length]} ${nicho} ${SUFFIXES[i % SUFFIXES.length]}`,
      categoria: nicho,
      cidade: cidade || 'Brasil',
      endereco: `${STREETS[i % STREETS.length]}, ${100 + i * 17}`,
      telefone: hasPhone ? phone : null,
      whatsapp: hasWhatsapp ? phone : null,
      website: i % 3 !== 1 ? `https://www.${nicho.toLowerCase().replace(/\s+/g, '')}-${i + 1}.com.br` : null,
      rating: i % 4 !== 0 ? parseFloat((3.5 + (i % 4) * 0.35).toFixed(1)) : null,
      reviews: i % 4 !== 0 ? 12 + i * 7 : null,
      temSite: i % 3 !== 1,
    }
  })
}

export default function LeadsCapturePage() {
  const [nicho, setNicho] = useState('')
  const [cidade, setCidade] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<ProspectLead[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [showImportModal, setShowImportModal] = useState(false)

  const limitWarning = PLAN_LIMIT.used >= PLAN_LIMIT.total * 0.8
  const limitExceeded = PLAN_LIMIT.used >= PLAN_LIMIT.total
  const allSelected = results.length > 0 && selectedIds.size === results.length
  const someSelected = selectedIds.size > 0

  const selectedLeads = useMemo(
    () => results.filter((l) => selectedIds.has(l.id)),
    [results, selectedIds]
  )

  const handleSearch = async () => {
    if (!nicho.trim()) return
    if (limitExceeded) {
      toast.error('Limite de leads atingido. Faça upgrade do plano.')
      return
    }
    setIsSearching(true)
    setSelectedIds(new Set())
    await new Promise((r) => setTimeout(r, 1500))
    setResults(generateMockLeads(nicho.trim(), cidade.trim()))
    setHasSearched(true)
    setIsSearching(false)
  }

  const handleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? new Set(results.map((l) => l.id)) : new Set())
  }

  const handleImportConfirm = (stageName: string) => {
    const count = selectedLeads.length
    setShowImportModal(false)
    setSelectedIds(new Set())
    toast.success(
      `${count} lead${count !== 1 ? 's' : ''} importado${count !== 1 ? 's' : ''} para "${stageName}"`
    )
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Captação de Leads"
        description="Encontre e importe leads via busca no Google"
      />

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-4"
      >
        {/* Limit indicator */}
        <motion.div variants={staggerItem}>
          <div
            className={`flex items-center justify-between rounded-lg border px-4 py-2.5 text-sm ${
              limitExceeded
                ? 'border-destructive/40 bg-destructive/10 text-destructive'
                : limitWarning
                  ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                  : 'border-border bg-card/40 text-muted-foreground'
            }`}
          >
            <span>
              {PLAN_LIMIT.used} de {PLAN_LIMIT.total} leads captados este mês
            </span>
            {(limitWarning || limitExceeded) && (
              <div className="flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5" />
                <span className="text-xs">
                  {limitExceeded ? 'Limite atingido. Faça upgrade.' : 'Próximo do limite do plano'}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Search form */}
        <motion.div variants={staggerItem}>
          <SearchForm
            nicho={nicho}
            cidade={cidade}
            isSearching={isSearching}
            onNichoChange={setNicho}
            onCidadeChange={setCidade}
            onSearch={handleSearch}
          />
        </motion.div>

        {/* Results */}
        <motion.div variants={staggerItem}>
          {!hasSearched ? (
            <div className="glass-card rounded-xl p-6">
              <EmptyState
                icon={UserSearch}
                title="Busque por leads"
                description="Use a busca acima para encontrar potenciais clientes. Os resultados aparecerão aqui."
              />
            </div>
          ) : (
            <ResultsList
              leads={results}
              selectedIds={selectedIds}
              allSelected={allSelected}
              someSelected={someSelected}
              onSelect={handleSelect}
              onSelectAll={handleSelectAll}
              onImport={() => setShowImportModal(true)}
            />
          )}
        </motion.div>
      </motion.div>

      <ImportLeadsModal
        open={showImportModal}
        onClose={() => setShowImportModal(false)}
        selectedCount={selectedLeads.length}
        onConfirm={handleImportConfirm}
      />
    </div>
  )
}
