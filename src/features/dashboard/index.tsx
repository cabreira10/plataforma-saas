import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, DollarSign, Target, Percent, Wallet, Plus } from 'lucide-react'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { MetricCard } from '@/shared/components/data/MetricCard'
import { Button } from '@/shared/components/ui/button'
import { staggerContainer } from '@/shared/lib/motion'
import { formatCurrency } from '@/shared/lib/utils'
import { AddRecordModal } from './components/modals/AddRecordModal'
import { GoalsModal } from './components/modals/GoalsModal'

// Mock data — will be replaced with Supabase queries
const MOCK_RECORDS = [
  { id: '1', type: 'income', amount: 5000, status: 'confirmed', date: '2026-02-01', description: 'Projeto A' },
  { id: '2', type: 'income', amount: 3500, status: 'confirmed', date: '2026-02-05', description: 'Projeto B' },
  { id: '3', type: 'expense', amount: 800, status: 'confirmed', date: '2026-02-03', description: 'Ferramentas' },
  { id: '4', type: 'expense', amount: 400, status: 'confirmed', date: '2026-02-07', description: 'Marketing' },
  { id: '5', type: 'income', amount: 2200, status: 'pending', date: '2026-02-10', description: 'Projeto C' },
]

const GOALS = { revenue: 15000, profit: 8000 }
const COMMISSION_RATE = 0.1

export default function DashboardPage() {
  const { t } = useTranslation('dashboard')
  const [showAddRecord, setShowAddRecord] = useState(false)
  const [showGoals, setShowGoals] = useState(false)

  const metrics = useMemo(() => {
    const totalIncome = MOCK_RECORDS
      .filter((r) => r.type === 'income' && r.status === 'confirmed')
      .reduce((sum, r) => sum + r.amount, 0)

    const totalExpenses = MOCK_RECORDS
      .filter((r) => r.type === 'expense')
      .reduce((sum, r) => sum + r.amount, 0)

    const totalCommission = totalIncome * COMMISSION_RATE
    const netProfit = totalIncome - totalExpenses - totalCommission

    return {
      totalIncome,
      totalExpenses,
      totalCommission,
      netProfit,
      revenueProgress: Math.min((totalIncome / GOALS.revenue) * 100, 100),
      profitProgress: Math.min((netProfit / GOALS.profit) * 100, 100),
    }
  }, [])

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title={t('title')}
        description={t('subtitle')}
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="gap-2" onClick={() => setShowGoals(true)}>
              <Target className="h-4 w-4" />
              Metas
            </Button>
            <Button size="sm" className="gap-2" onClick={() => setShowAddRecord(true)}>
              <Plus className="h-4 w-4" />
              Registrar
            </Button>
          </div>
        }
      />

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <MetricCard
          label={t('metrics.income')}
          value={formatCurrency(metrics.totalIncome)}
          icon={TrendingUp}
          glowing
          trend={{ value: 12, label: t('metrics.vsLastMonth') }}
        />
        <MetricCard
          label={t('metrics.expenses')}
          value={formatCurrency(metrics.totalExpenses)}
          icon={TrendingDown}
          trend={{ value: -3, label: t('metrics.vsLastMonth') }}
        />
        <MetricCard
          label={t('metrics.commission')}
          value={formatCurrency(metrics.totalCommission)}
          icon={Percent}
          description={`${COMMISSION_RATE * 100}% ${t('metrics.onIncome')}`}
        />
        <MetricCard
          label={t('metrics.netProfit')}
          value={formatCurrency(metrics.netProfit)}
          icon={DollarSign}
          glowing
          trend={{ value: 8, label: t('metrics.vsLastMonth') }}
        />
        <MetricCard
          label={t('metrics.revenueGoal')}
          value={`${metrics.revenueProgress.toFixed(0)}%`}
          icon={Target}
          description={`${formatCurrency(metrics.totalIncome)} / ${formatCurrency(GOALS.revenue)}`}
        />
        <MetricCard
          label={t('metrics.profitGoal')}
          value={`${metrics.profitProgress.toFixed(0)}%`}
          icon={Wallet}
          description={`${formatCurrency(metrics.netProfit)} / ${formatCurrency(GOALS.profit)}`}
        />
      </motion.div>

      <AddRecordModal open={showAddRecord} onClose={() => setShowAddRecord(false)} />
      <GoalsModal open={showGoals} onClose={() => setShowGoals(false)} />

      {/* Table placeholder */}
      <div className="glass-card rounded-xl p-6">
        <p className="text-label mb-4">{t('table.title')}</p>
        <div className="space-y-2">
          {MOCK_RECORDS.map((record) => (
            <div key={record.id} className="flex items-center justify-between rounded-lg bg-muted/20 px-4 py-3">
              <div>
                <p className="text-sm font-medium">{record.description}</p>
                <p className="text-xs text-muted-foreground">{record.date}</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold ${record.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {record.type === 'income' ? '+' : '-'}{formatCurrency(record.amount)}
                </p>
                <p className="text-xs text-muted-foreground capitalize">{record.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
