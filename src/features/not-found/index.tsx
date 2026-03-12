import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, SearchX } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { scaleIn } from '@/shared/lib/motion'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-6 text-center">
      <motion.div
        variants={scaleIn}
        initial="initial"
        animate="animate"
        className="space-y-6"
      >
        {/* Icon backdrop */}
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
          <SearchX className="h-12 w-12 text-primary/60" />
        </div>

        {/* 404 number */}
        <p className="text-8xl font-bold text-primary/20 select-none leading-none">404</p>

        {/* Message */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Página não encontrada</h1>
          <p className="max-w-sm text-sm text-muted-foreground">
            A página que você procura não existe ou foi movida para outro endereço.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button asChild className="gap-2">
            <Link to="/app/dashboard">
              <Home className="h-4 w-4" />
              Voltar ao início
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/app/crm">Ir para o CRM</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
