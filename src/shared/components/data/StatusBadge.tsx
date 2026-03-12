import { cn } from '@/shared/lib/utils'

type StatusVariant =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'muted'
  | 'purple'
  | 'orange'

const VARIANT_CLASSES: Record<StatusVariant, string> = {
  success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  warning: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  danger: 'bg-red-500/15 text-red-400 border-red-500/20',
  info: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  muted: 'bg-muted/50 text-muted-foreground border-border/50',
  purple: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  orange: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
}

interface StatusBadgeProps {
  label: string
  variant?: StatusVariant
  className?: string
  dot?: boolean
}

export function StatusBadge({ label, variant = 'muted', className, dot }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium',
        VARIANT_CLASSES[variant],
        className,
      )}
    >
      {dot && (
        <span className={cn('h-1.5 w-1.5 rounded-full bg-current')} />
      )}
      {label}
    </span>
  )
}
