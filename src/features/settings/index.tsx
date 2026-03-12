import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { User, Building2, Globe } from 'lucide-react'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/lib/utils'
import { staggerContainer, staggerItem } from '@/shared/lib/motion'
import { useState } from 'react'

type SettingsTab = 'profile' | 'workspace' | 'language'

interface Tab {
  id: SettingsTab
  label: string
  icon: React.ElementType
}

export default function SettingsPage() {
  const { t } = useTranslation('settings')
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile')

  const tabs: Tab[] = [
    { id: 'profile', label: t('tabs.profile'), icon: User },
    { id: 'workspace', label: t('tabs.workspace'), icon: Building2 },
    { id: 'language', label: t('tabs.language'), icon: Globe },
  ]

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title={t('title')}
        description={t('subtitle')}
      />

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="flex gap-6"
      >
        {/* Sidebar tabs */}
        <motion.div variants={staggerItem} className="glass-card h-fit w-52 shrink-0 rounded-xl p-2">
          <nav className="flex flex-col gap-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  activeTab === id
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </nav>
        </motion.div>

        {/* Tab content */}
        <motion.div variants={staggerItem} className="glass-card flex-1 rounded-xl p-6 space-y-6">
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-foreground">{t('tabs.profile')}</h2>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User className="h-8 w-8" />
                </div>
                <Button variant="outline" size="sm">
                  {t('profile.changeAvatar')}
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">{t('profile.name')}</label>
                  <input
                    type="text"
                    className="h-9 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder={t('profile.namePlaceholder')}
                    readOnly
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">{t('profile.email')}</label>
                  <input
                    type="email"
                    className="h-9 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder={t('profile.emailPlaceholder')}
                    readOnly
                  />
                </div>
              </div>
              <div className="pt-2">
                <Button size="sm">{t('profile.save')}</Button>
              </div>
            </div>
          )}

          {activeTab === 'workspace' && (
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-foreground">{t('tabs.workspace')}</h2>
              <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                <Building2 className="h-10 w-10 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">{t('workspace.comingSoon')}</p>
              </div>
            </div>
          )}

          {activeTab === 'language' && (
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-foreground">{t('tabs.language')}</h2>
              <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                <Globe className="h-10 w-10 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">{t('language.comingSoon')}</p>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}
