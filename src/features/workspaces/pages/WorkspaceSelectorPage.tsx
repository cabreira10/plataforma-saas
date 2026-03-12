import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Building2, Plus, ChevronRight } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { useWorkspaceStore } from '@/shared/stores/workspace.store'
import { staggerContainer, staggerItem } from '@/shared/lib/motion'
import { cn } from '@/shared/lib/utils'

export function WorkspaceSelectorPage() {
  const { t } = useTranslation('common')
  const navigate = useNavigate()
  const { workspaces, setActiveWorkspace } = useWorkspaceStore()

  const handleSelect = (ws: typeof workspaces[0]) => {
    setActiveWorkspace(ws)
    navigate('/app/dashboard')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-glow-sm">
            <span className="text-lg font-bold text-primary-foreground">P</span>
          </div>
          <h1 className="text-2xl font-bold">{t('workspace.selectTitle')}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t('workspace.selectSubtitle')}</p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-2"
        >
          {workspaces.map((ws) => (
            <motion.button
              key={ws.id}
              variants={staggerItem}
              onClick={() => handleSelect(ws)}
              className={cn(
                'glass-card hover-lift flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors',
                'hover:glow-border',
              )}
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/20">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground">{ws.name}</p>
                <p className="text-xs text-muted-foreground">
                  {t(`roles.${ws.role}`)} · {ws.memberCount} {t('workspace.members')}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            </motion.button>
          ))}

          <motion.div variants={staggerItem}>
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => navigate('/workspaces/new')}
            >
              <Plus className="h-4 w-4" />
              {t('workspace.create')}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
