import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Plus, FileText } from 'lucide-react'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { EmptyState } from '@/shared/components/layout/EmptyState'
import { Button } from '@/shared/components/ui/button'
import { staggerContainer } from '@/shared/lib/motion'
import { NewContractModal } from './components/modals/NewContractModal'

export default function ContractsPage() {
  const { t } = useTranslation('contracts')
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title={t('title')}
        description={t('subtitle')}
        actions={
          <Button size="sm" className="gap-2" onClick={() => setShowModal(true)}>
            <Plus className="h-4 w-4" />
            {t('create')}
          </Button>
        }
      />

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-4"
      >
        <div className="glass-card rounded-xl p-6">
          <EmptyState
            icon={FileText}
            title={t('empty.title')}
            description={t('empty.description')}
            action={
              <Button className="gap-2" onClick={() => setShowModal(true)}>
                <Plus className="h-4 w-4" />
                {t('create')}
              </Button>
            }
          />
        </div>
      </motion.div>

      <NewContractModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  )
}
