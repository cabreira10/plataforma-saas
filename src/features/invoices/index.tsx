import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Plus, Receipt } from 'lucide-react'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { EmptyState } from '@/shared/components/layout/EmptyState'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/lib/utils'
import { staggerContainer, staggerItem } from '@/shared/lib/motion'
import { EmitInvoiceModal } from './components/modals/EmitInvoiceModal'

type InvoiceTab = 'nfe' | 'nfse'

export default function InvoicesPage() {
  const { t } = useTranslation('invoices')
  const [activeTab, setActiveTab] = useState<InvoiceTab>('nfe')
  const [showModal, setShowModal] = useState(false)

  const tabs: { id: InvoiceTab; label: string }[] = [
    { id: 'nfe', label: t('tabs.nfe') },
    { id: 'nfse', label: t('tabs.nfse') },
  ]

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title={t('title')}
        description={t('subtitle')}
        actions={
          <Button size="sm" className="gap-2" onClick={() => setShowModal(true)}>
            <Plus className="h-4 w-4" />
            {t('emit')}
          </Button>
        }
      />

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-4"
      >
        {/* Tab bar */}
        <motion.div variants={staggerItem} className="glass-card rounded-xl p-1 flex gap-1 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              )}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Tab content */}
        <motion.div variants={staggerItem} className="glass-card rounded-xl p-6">
          <EmptyState
            icon={Receipt}
            title={t('empty.title', { type: activeTab.toUpperCase() })}
            description={t('empty.description')}
            action={
              <Button className="gap-2" onClick={() => setShowModal(true)}>
                <Plus className="h-4 w-4" />
                {t('emit')}
              </Button>
            }
          />
        </motion.div>
      </motion.div>

      <EmitInvoiceModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  )
}
