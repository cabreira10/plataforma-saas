import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { scaleIn, fadeInUp } from '@/shared/lib/motion'

export function CreateWorkspacePage() {
  const { t } = useTranslation('common')
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <motion.div variants={scaleIn} initial="initial" animate="animate" className="w-full max-w-md">
        <div className="glass-card rounded-2xl p-8 shadow-card">
          <motion.div variants={fadeInUp}>
            <button
              onClick={() => navigate('/workspaces')}
              className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> {t('actions.back')}
            </button>
            <h1 className="text-2xl font-bold">{t('workspace.createTitle')}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{t('workspace.createSubtitle')}</p>
          </motion.div>

          <div className="mt-6 space-y-4">
            <motion.div variants={fadeInUp} className="space-y-2">
              <Label>{t('workspace.name')}</Label>
              <Input placeholder={t('workspace.namePlaceholder')} />
            </motion.div>
            <motion.div variants={fadeInUp} className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => navigate('/workspaces')}>
                {t('actions.cancel')}
              </Button>
              <Button className="flex-1">{t('workspace.create')}</Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
