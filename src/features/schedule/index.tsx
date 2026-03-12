import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { CalendarDays, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/lib/utils'
import { staggerContainer, staggerItem } from '@/shared/lib/motion'
import { AppointmentModal } from './components/modals/AppointmentModal'

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

function buildCalendarGrid(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = Array(firstDay).fill(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  return cells
}

export default function SchedulePage() {
  const { t } = useTranslation('schedule')
  const today = new Date()
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [showModal, setShowModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | undefined>()

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const cells = buildCalendarGrid(year, month)

  const monthLabel = viewDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })

  function prevMonth() { setViewDate(new Date(year, month - 1, 1)) }
  function nextMonth() { setViewDate(new Date(year, month + 1, 1)) }

  function handleDayClick(day: number) {
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    setSelectedDate(date)
    setShowModal(true)
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title={t('title')}
        description={t('subtitle')}
        actions={
          <Button size="sm" className="gap-2" onClick={() => setShowModal(true)}>
            <Plus className="h-4 w-4" />
            {t('newEvent')}
          </Button>
        }
      />

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-4"
      >
        <motion.div variants={staggerItem} className="glass-card rounded-xl p-6 space-y-4">
          {/* Month navigation */}
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold capitalize text-foreground">{monthLabel}</h2>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-px">
            {WEEKDAYS.map((day) => (
              <div key={day} className="py-2 text-center text-xs font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-px">
            {cells.map((day, idx) => {
              const isToday =
                day !== null &&
                day === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear()

              return (
                <div
                  key={idx}
                  onClick={() => day !== null && handleDayClick(day)}
                  className={cn(
                    'flex h-10 w-full items-center justify-center rounded-lg text-sm transition-colors',
                    day === null && 'invisible',
                    day !== null && 'cursor-pointer hover:bg-white/5 text-muted-foreground hover:text-foreground',
                    isToday && 'bg-primary text-primary-foreground font-bold hover:bg-primary/90 hover:text-primary-foreground'
                  )}
                >
                  {day}
                </div>
              )
            })}
          </div>

          {/* Placeholder notice */}
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-3">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">{t('empty.description')}</p>
          </div>
        </motion.div>
      </motion.div>

      <AppointmentModal
        open={showModal}
        onClose={() => { setShowModal(false); setSelectedDate(undefined) }}
        defaultDate={selectedDate}
      />
    </div>
  )
}
