import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Users, UserPlus, Search } from 'lucide-react'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { EmptyState } from '@/shared/components/layout/EmptyState'
import { Button } from '@/shared/components/ui/button'
import { staggerContainer, staggerItem } from '@/shared/lib/motion'
import { InviteModal } from './components/modals/InviteModal'

export default function UsersPage() {
  const { t } = useTranslation('users')
  const [showInvite, setShowInvite] = useState(false)

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title={t('title')}
        description={t('subtitle')}
        actions={
          <Button size="sm" className="gap-2" onClick={() => setShowInvite(true)}>
            <UserPlus className="h-4 w-4" />
            {t('invite')}
          </Button>
        }
      />

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-4"
      >
        {/* Search / filter bar */}
        <motion.div variants={staggerItem} className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder={t('search.placeholder')}
                className="h-10 w-full rounded-lg border border-white/10 bg-white/5 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                readOnly
              />
            </div>
          </div>
        </motion.div>

        {/* Table placeholder */}
        <motion.div variants={staggerItem} className="glass-card rounded-xl p-6">
          <EmptyState
            icon={Users}
            title={t('empty.title')}
            description={t('empty.description')}
            action={
              <Button className="gap-2" onClick={() => setShowInvite(true)}>
                <UserPlus className="h-4 w-4" />
                {t('invite')}
              </Button>
            }
          />
        </motion.div>
      </motion.div>

      <InviteModal open={showInvite} onClose={() => setShowInvite(false)} />
    </div>
  )
}
