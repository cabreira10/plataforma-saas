import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Zap, Check } from 'lucide-react'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/lib/utils'
import { staggerContainer, staggerItem } from '@/shared/lib/motion'

interface PlanCardProps {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  highlighted?: boolean
  ctaLabel: string
}

function PlanCard({ name, price, period, description, features, highlighted, ctaLabel }: PlanCardProps) {
  return (
    <motion.div
      variants={staggerItem}
      className={cn(
        'glass-card relative flex flex-col gap-6 rounded-xl p-6',
        highlighted && 'ring-2 ring-primary'
      )}
    >
      {highlighted && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground">
          Popular
        </span>
      )}

      <div className="space-y-1">
        <h3 className="text-base font-bold text-foreground">{name}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>

      <div className="flex items-end gap-1">
        <span className="text-3xl font-bold text-foreground">{price}</span>
        <span className="mb-1 text-sm text-muted-foreground">/{period}</span>
      </div>

      <ul className="space-y-2 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
            <Check className="h-4 w-4 shrink-0 text-primary" />
            {f}
          </li>
        ))}
      </ul>

      <Button
        className="w-full"
        variant={highlighted ? 'default' : 'outline'}
      >
        {ctaLabel}
      </Button>
    </motion.div>
  )
}

export default function BillingPage() {
  const { t } = useTranslation('billing')

  const plans: PlanCardProps[] = [
    {
      name: t('plans.starter.name'),
      price: 'R$ 0',
      period: t('plans.period'),
      description: t('plans.starter.description'),
      features: [
        t('plans.starter.features.f1'),
        t('plans.starter.features.f2'),
        t('plans.starter.features.f3'),
      ],
      ctaLabel: t('plans.selectPlan'),
    },
    {
      name: t('plans.pro.name'),
      price: 'R$ 97',
      period: t('plans.period'),
      description: t('plans.pro.description'),
      features: [
        t('plans.pro.features.f1'),
        t('plans.pro.features.f2'),
        t('plans.pro.features.f3'),
        t('plans.pro.features.f4'),
      ],
      highlighted: true,
      ctaLabel: t('plans.selectPlan'),
    },
    {
      name: t('plans.enterprise.name'),
      price: t('plans.enterprise.price'),
      period: t('plans.period'),
      description: t('plans.enterprise.description'),
      features: [
        t('plans.enterprise.features.f1'),
        t('plans.enterprise.features.f2'),
        t('plans.enterprise.features.f3'),
        t('plans.enterprise.features.f4'),
      ],
      ctaLabel: t('plans.contactSales'),
    },
  ]

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title={t('title')}
        description={t('subtitle')}
        actions={
          <Button size="sm" variant="outline" className="gap-2">
            <Zap className="h-4 w-4" />
            {t('manageBilling')}
          </Button>
        }
      />

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-6"
      >
        {/* Plan cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard key={plan.name} {...plan} />
          ))}
        </div>

        {/* Current plan / invoice history placeholder */}
        <motion.div variants={staggerItem} className="glass-card rounded-xl p-6">
          <h3 className="mb-4 text-sm font-semibold text-foreground">{t('invoiceHistory')}</h3>
          <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
            <Zap className="h-10 w-10 text-muted-foreground/30" />
            <p className="text-xs text-muted-foreground">{t('empty.noInvoices')}</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
