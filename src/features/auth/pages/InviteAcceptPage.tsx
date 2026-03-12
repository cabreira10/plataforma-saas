import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { UserPlus } from 'lucide-react'
import { ParticleBackground } from '@/shared/components/overlay/ParticleBackground'
import { Button } from '@/shared/components/ui/button'
import { scaleIn, fadeInUp } from '@/shared/lib/motion'

export function InviteAcceptPage() {
  const { token } = useParams()
  const { t } = useTranslation('auth')

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      <ParticleBackground />
      <motion.div variants={scaleIn} initial="initial" animate="animate" className="relative z-10 w-full max-w-md px-4">
        <div className="glass-card rounded-2xl p-8 text-center shadow-card">
          <motion.div variants={fadeInUp} className="mb-6">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/20">
              <UserPlus className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">{t('invite.title')}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {t('invite.subtitle', { token })}
            </p>
          </motion.div>
          <motion.div variants={fadeInUp} className="flex flex-col gap-3">
            <Button>{t('invite.accept')}</Button>
            <Button variant="ghost">{t('invite.decline')}</Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
