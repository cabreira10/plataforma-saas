import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { MessageSquareMore, Plus, MessageCircle, Mail, Phone, Hash, Calendar } from 'lucide-react'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/lib/utils'
import { staggerContainer, staggerItem } from '@/shared/lib/motion'
import { AddFollowUpModal, type FollowUpCardData } from './components/modals/AddFollowUpModal'

const canalIcons: Record<string, React.ElementType> = {
  whatsapp: MessageCircle,
  email: Mail,
  telefone: Phone,
  outro: Hash,
}

interface KanbanColumn {
  id: string
  label: string
  colorClass: string
  headerColor: string
}

const columns: KanbanColumn[] = [
  {
    id: 'new',
    label: 'Novo',
    colorClass: 'border-blue-500/30 bg-blue-500/5',
    headerColor: 'text-blue-400',
  },
  {
    id: 'contacted',
    label: 'Contactado',
    colorClass: 'border-amber-500/30 bg-amber-500/5',
    headerColor: 'text-amber-400',
  },
  {
    id: 'negotiating',
    label: 'Negociando',
    colorClass: 'border-violet-500/30 bg-violet-500/5',
    headerColor: 'text-violet-400',
  },
  {
    id: 'won',
    label: 'Ganho',
    colorClass: 'border-emerald-500/30 bg-emerald-500/5',
    headerColor: 'text-emerald-400',
  },
  {
    id: 'lost',
    label: 'Perdido',
    colorClass: 'border-red-500/30 bg-red-500/5',
    headerColor: 'text-red-400',
  },
]

function FollowUpCard({ card }: { card: FollowUpCardData }) {
  const CanalIcon = canalIcons[card.canal] ?? Hash

  return (
    <div className="rounded-lg border border-border bg-card/60 p-3 space-y-2 cursor-pointer hover:border-primary/30 transition-colors">
      <p className="text-sm font-medium text-foreground leading-snug">{card.titulo}</p>
      <p className="text-xs text-muted-foreground">{card.cliente}</p>

      <div className="flex items-center justify-between pt-1">
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <CanalIcon className="h-3 w-3" />
          {card.canal.charAt(0).toUpperCase() + card.canal.slice(1)}
        </span>

        {card.proximoContato && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {new Date(card.proximoContato + 'T00:00:00').toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
            })}
          </span>
        )}
      </div>
    </div>
  )
}

export default function FollowUpPage() {
  const { t } = useTranslation('followUp')
  const [cards, setCards] = useState<FollowUpCardData[]>([])
  const [addModal, setAddModal] = useState<{ open: boolean; column: string }>({
    open: false,
    column: 'new',
  })

  function openAdd(column: string) {
    setAddModal({ open: true, column })
  }

  function closeAdd() {
    setAddModal((s) => ({ ...s, open: false }))
  }

  function handleSave(data: Omit<FollowUpCardData, 'id'>) {
    setCards((prev) => [...prev, { ...data, id: Date.now().toString() }])
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title={t('title')}
        description={t('subtitle')}
        actions={
          <Button size="sm" className="gap-2" onClick={() => openAdd('new')}>
            <Plus className="h-4 w-4" />
            {t('addCard')}
          </Button>
        }
      />

      <motion.div variants={staggerContainer} initial="initial" animate="animate">
        <motion.div variants={staggerItem} className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((col) => {
            const colCards = cards.filter((c) => c.coluna === col.id)

            return (
              <div
                key={col.id}
                className={cn(
                  'flex min-w-[260px] max-w-[260px] flex-col gap-3 rounded-xl border p-4',
                  col.colorClass,
                )}
              >
                <div className="flex items-center justify-between">
                  <h3 className={cn('text-sm font-semibold', col.headerColor)}>{col.label}</h3>
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white/10 px-1.5 text-xs font-medium text-muted-foreground">
                    {colCards.length}
                  </span>
                </div>

                {colCards.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-white/10 py-8">
                    <MessageSquareMore className="h-6 w-6 text-muted-foreground/30" />
                    <p className="text-xs text-muted-foreground/50">{t('empty.columnEmpty')}</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {colCards.map((card) => (
                      <FollowUpCard key={card.id} card={card} />
                    ))}
                  </div>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full gap-2 border border-dashed border-white/10 text-muted-foreground hover:text-foreground"
                  onClick={() => openAdd(col.id)}
                >
                  <Plus className="h-3.5 w-3.5" />
                  {t('addCard')}
                </Button>
              </div>
            )
          })}
        </motion.div>
      </motion.div>

      <AddFollowUpModal
        open={addModal.open}
        onClose={closeAdd}
        onSave={handleSave}
        defaultColumn={addModal.column}
      />
    </div>
  )
}
