import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Suspense } from 'react'
import { DashboardSidebar } from './DashboardSidebar'
import { pageTransition } from '@/shared/lib/motion'
import { LoadingSkeleton } from '@/shared/components/feedback/LoadingSkeleton'

export function AuthenticatedLayout() {
  const location = useLocation()

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Suspense fallback={<LoadingSkeleton />}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageTransition}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex-1 overflow-y-auto"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </main>
    </div>
  )
}
