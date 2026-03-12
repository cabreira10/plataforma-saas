import { type LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/shared/lib/utils'
import { staggerItem } from '@/shared/lib/motion'

interface MetricCardProps {
  label: string
  value: string | number
  description?: string
  icon?: LucideIcon
  trend?: {
    value: number
    label?: string
  }
  className?: string
  glowing?: boolean
}

export function MetricCard({
  label,
  value,
  description,
  icon: Icon,
  trend,
  className,
  glowing,
}: MetricCardProps) {
  const isPositiveTrend = trend && trend.value > 0
  const isNegativeTrend = trend && trend.value < 0

  return (
    <motion.div
      variants={staggerItem}
      className={cn(
        'glass-card hover-lift group relative overflow-hidden rounded-xl p-5',
        glowing && 'glow-border',
        className,
      )}
    >
      {/* Background orb */}
      {glowing && (
        <div className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full bg-primary/10 blur-xl" />
      )}

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-label">{label}</p>
          <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>

        {Icon && (
          <div className={cn(
            'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg',
            glowing ? 'bg-primary/20 text-primary' : 'bg-muted/50 text-muted-foreground',
          )}>
            <Icon className="h-4.5 w-4.5" />
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-3 flex items-center gap-1.5">
          <span
            className={cn(
              'text-xs font-medium',
              isPositiveTrend && 'text-emerald-400',
              isNegativeTrend && 'text-red-400',
              !isPositiveTrend && !isNegativeTrend && 'text-muted-foreground',
            )}
          >
            {isPositiveTrend ? '+' : ''}
            {trend.value}%
          </span>
          {trend.label && (
            <span className="text-xs text-muted-foreground">{trend.label}</span>
          )}
        </div>
      )}
    </motion.div>
  )
}
