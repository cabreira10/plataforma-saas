import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ParticleBackground } from '@/shared/components/overlay/ParticleBackground'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { fadeInUp, scaleIn } from '@/shared/lib/motion'

export function RegisterPage() {
  const { t } = useTranslation('auth')

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      <ParticleBackground />
      <motion.div variants={scaleIn} initial="initial" animate="animate" className="relative z-10 w-full max-w-md px-4">
        <div className="glass-card rounded-2xl p-8 shadow-card">
          <motion.div variants={fadeInUp} className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-glow-sm">
              <span className="text-lg font-bold text-primary-foreground">P</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">{t('register.title')}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{t('register.subtitle')}</p>
          </motion.div>

          <div className="space-y-4">
            <motion.div variants={fadeInUp} className="space-y-2">
              <Label>{t('fields.name')}</Label>
              <Input placeholder="João Silva" />
            </motion.div>
            <motion.div variants={fadeInUp} className="space-y-2">
              <Label>{t('fields.email')}</Label>
              <Input type="email" placeholder="seu@email.com" />
            </motion.div>
            <motion.div variants={fadeInUp} className="space-y-2">
              <Label>{t('fields.password')}</Label>
              <Input type="password" placeholder="••••••••" />
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Button className="w-full">{t('register.submit')}</Button>
            </motion.div>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {t('register.hasAccount')}{' '}
            <Link to="/login" className="font-medium text-primary hover:underline">
              {t('register.login')}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
