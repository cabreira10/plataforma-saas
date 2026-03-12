import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { ParticleBackground } from '@/shared/components/overlay/ParticleBackground'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { scaleIn, fadeInUp } from '@/shared/lib/motion'

export function ForgotPasswordPage() {
  const { t } = useTranslation('auth')

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      <ParticleBackground />
      <motion.div variants={scaleIn} initial="initial" animate="animate" className="relative z-10 w-full max-w-md px-4">
        <div className="glass-card rounded-2xl p-8 shadow-card">
          <motion.div variants={fadeInUp} className="mb-8">
            <Link to="/login" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> {t('forgotPassword.back')}
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">{t('forgotPassword.title')}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{t('forgotPassword.subtitle')}</p>
          </motion.div>

          <div className="space-y-4">
            <motion.div variants={fadeInUp} className="space-y-2">
              <Label>{t('fields.email')}</Label>
              <Input type="email" placeholder="seu@email.com" />
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Button className="w-full">{t('forgotPassword.submit')}</Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
