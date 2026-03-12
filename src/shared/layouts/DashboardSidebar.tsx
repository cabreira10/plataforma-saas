import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Users2,
  FileText,
  Receipt,
  ShoppingCart,
  UserSearch,
  CalendarDays,
  CreditCard,
  MessageSquareMore,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Building2,
} from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { useUIStore } from '@/shared/stores/ui.store'
import { useAuthStore } from '@/shared/stores/auth.store'
import { useWorkspaceStore } from '@/shared/stores/workspace.store'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'

const NAV_ITEMS = [
  { to: '/app/dashboard', icon: LayoutDashboard, labelKey: 'nav.dashboard' },
  { to: '/app/crm', icon: Users2, labelKey: 'nav.crm' },
  { to: '/app/contracts', icon: FileText, labelKey: 'nav.contracts' },
  { to: '/app/invoices', icon: Receipt, labelKey: 'nav.invoices' },
  { to: '/app/checkout', icon: ShoppingCart, labelKey: 'nav.checkout' },
  { to: '/app/leads', icon: UserSearch, labelKey: 'nav.leads' },
  { to: '/app/schedule', icon: CalendarDays, labelKey: 'nav.schedule' },
  { to: '/app/payments', icon: CreditCard, labelKey: 'nav.payments' },
  { to: '/app/follow-up', icon: MessageSquareMore, labelKey: 'nav.followUp' },
]

export function DashboardSidebar() {
  const { t } = useTranslation('common')
  const { sidebarCollapsed, toggleSidebar } = useUIStore()
  const { user, logout } = useAuthStore()
  const { activeWorkspace } = useWorkspaceStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const sidebarWidth = sidebarCollapsed
    ? 'var(--sidebar-width-collapsed)'
    : 'var(--sidebar-width)'

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        animate={{ width: sidebarWidth }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="relative flex h-screen flex-shrink-0 flex-col border-r border-sidebar-border bg-[hsl(var(--sidebar-background))]"
        style={{ width: sidebarWidth }}
      >
        {/* Logo */}
        <div className="flex h-14 items-center border-b border-sidebar-border px-4">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-primary shadow-glow-sm">
              <span className="text-xs font-bold text-primary-foreground">P</span>
            </div>
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden whitespace-nowrap text-sm font-semibold text-sidebar-foreground"
                >
                  Platform
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Workspace selector */}
        <AnimatePresence>
          {!sidebarCollapsed && activeWorkspace && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="border-b border-sidebar-border px-4 py-3"
            >
              <button
                onClick={() => navigate('/workspaces')}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-sidebar-accent"
              >
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded bg-primary/20">
                  <Building2 className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-sidebar-foreground">
                    {activeWorkspace.name}
                  </p>
                  <p className="text-label">{t(`roles.${activeWorkspace.role}`)}</p>
                </div>
                <ChevronRight className="ml-auto h-3 w-3 flex-shrink-0 text-muted-foreground" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-3">
          <ul className="space-y-0.5">
            {NAV_ITEMS.map(({ to, icon: Icon, labelKey }) => (
              <li key={to}>
                {sidebarCollapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <NavLink
                        to={to}
                        className={({ isActive }) =>
                          cn(
                            'flex h-9 w-9 items-center justify-center rounded-md mx-auto transition-colors',
                            isActive
                              ? 'bg-primary/15 text-primary shadow-glow-sm'
                              : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground',
                          )
                        }
                      >
                        <Icon className="h-4 w-4" />
                      </NavLink>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{t(labelKey)}</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      cn(
                        'flex h-9 items-center gap-2.5 rounded-md px-3 text-sm transition-colors',
                        isActive
                          ? 'bg-primary/15 font-medium text-primary shadow-glow-sm'
                          : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground',
                      )
                    }
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{t(labelKey)}</span>
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border px-2 py-3">
          {/* Settings */}
          {sidebarCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <NavLink
                  to="/app/settings"
                  className={({ isActive }) =>
                    cn(
                      'flex h-9 w-9 items-center justify-center rounded-md mx-auto transition-colors',
                      isActive
                        ? 'bg-primary/15 text-primary'
                        : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground',
                    )
                  }
                >
                  <Settings className="h-4 w-4" />
                </NavLink>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{t('nav.settings')}</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <NavLink
              to="/app/settings"
              className={({ isActive }) =>
                cn(
                  'flex h-9 items-center gap-2.5 rounded-md px-3 text-sm transition-colors',
                  isActive
                    ? 'bg-primary/15 font-medium text-primary'
                    : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground',
                )
              }
            >
              <Settings className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{t('nav.settings')}</span>
            </NavLink>
          )}

          {/* User + Logout */}
          <div className={cn('mt-2', sidebarCollapsed ? 'flex justify-center' : '')}>
            {sidebarCollapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleLogout}
                    className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{t('actions.logout')}</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <div className="flex items-center gap-2 rounded-md px-2 py-1.5">
                <Avatar className="h-7 w-7 flex-shrink-0">
                  <AvatarImage src={user?.avatarUrl} />
                  <AvatarFallback className="bg-primary/20 text-xs text-primary">
                    {user?.name?.charAt(0)?.toUpperCase() ?? user?.email?.charAt(0)?.toUpperCase() ?? 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-sidebar-foreground">
                    {user?.name ?? user?.email}
                  </p>
                  <p className="text-label truncate">{user?.email}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 flex-shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-16 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:text-foreground"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </button>
      </motion.aside>
    </TooltipProvider>
  )
}
