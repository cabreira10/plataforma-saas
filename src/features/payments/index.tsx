import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { CreditCard, TrendingUp, TrendingDown, DollarSign, Clock, Webhook } from 'lucide-react'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/lib/utils'
import { staggerContainer, staggerItem } from '@/shared/lib/motion'
import { WebhookModal } from './components/modals/WebhookModal'

interface FinancialMetricProps {
  label: string
  value: string
  trend?: string
  icon: React.ElementType
  colorClass: string
}

function FinancialMetric({ label, value, trend, icon: Icon, colorClass }: FinancialMetricProps) {
  return (
    <motion.div variants={staggerItem} className="glass-card rounded-xl p-6 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', colorClass)}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      {trend && (
        <p className="text-xs text-muted-foreground">{trend}</p>
      )}
    </motion.div>
  )
}

export default function PaymentsPage() {
  const { t } = useTranslation('payments')
  const [showWebhook, setShowWebhook] = useState(false)

  const metrics: FinancialMetricProps[] = [
    {
      label: t('metrics.totalReceived'),
      value: 'R$ 0,00',
      trend: t('metrics.thisMonth'),
      icon: TrendingUp,
      colorClass: 'bg-emerald-500/10 text-emerald-400',
    },
    {
      label: t('metrics.totalPending'),
      value: 'R$ 0,00',
      trend: t('metrics.awaitingConfirmation'),
      icon: Clock,
      colorClass: 'bg-amber-500/10 text-amber-400',
    },
    {
      label: t('metrics.totalOverdue'),
      value: 'R$ 0,00',
      icon: TrendingDown,
      colorClass: 'bg-red-500/10 text-red-400',
    },
    {
      label: t('metrics.balance'),
      value: 'R$ 0,00',
      icon: DollarSign,
      colorClass: 'bg-primary/10 text-primary',
    },
  ]

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title={t('title')}
        description={t('subtitle')}
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="gap-2" onClick={() => setShowWebhook(true)}>
              <Webhook className="h-4 w-4" />
              Webhook
            </Button>
            <Button size="sm" className="gap-2">
              <CreditCard className="h-4 w-4" />
              {t('newPayment')}
            </Button>
          </div>
        }
      />

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-6"
      >
        {/* Financial metrics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m) => (
            <FinancialMetric key={m.label} {...m} />
          ))}
        </div>

        {/* Transactions placeholder */}
        <motion.div variants={staggerItem} className="glass-card rounded-xl p-6">
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
            <CreditCard className="h-12 w-12 text-muted-foreground/30" />
            <p className="text-sm font-medium text-muted-foreground">{t('empty.title')}</p>
            <p className="text-xs text-muted-foreground/60">{t('empty.description')}</p>
          </div>
        </motion.div>
      </motion.div>

      <WebhookModal open={showWebhook} onClose={() => setShowWebhook(false)} />
    </div>
  )
}
