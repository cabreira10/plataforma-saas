import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Github, Chrome, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { ParticleBackground } from '@/shared/components/overlay/ParticleBackground'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Separator } from '@/shared/components/ui/separator'
import { fadeInUp, scaleIn } from '@/shared/lib/motion'
import { useAuthStore } from '@/shared/stores/auth.store'
import { useWorkspaceStore } from '@/shared/stores/workspace.store'
import type { User } from '@/shared/types/auth.types'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  rememberMe: z.boolean().optional(),
})

type LoginForm = z.infer<typeof loginSchema>

export function LoginPage() {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const { setSession } = useAuthStore()
  const { setActiveWorkspace, setWorkspaces } = useWorkspaceStore()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  })

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    try {
      // TODO: Replace with real Supabase auth
      await new Promise((resolve) => setTimeout(resolve, 800))

      const mockUser: User = {
        id: 'user-1',
        email: data.email,
        name: 'Usuário Demo',
        language: 'pt-BR',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const mockWorkspace = {
        id: 'ws-1',
        name: 'Meu Negócio',
        slug: 'meu-negocio',
        ownerId: mockUser.id,
        role: 'owner' as const,
        memberCount: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setSession({
        accessToken: 'mock-token',
        refreshToken: 'mock-refresh',
        expiresAt: Date.now() + 3600000,
        user: mockUser,
      })

      setWorkspaces([mockWorkspace])
      setActiveWorkspace(mockWorkspace)
      navigate('/app/dashboard')
    } catch {
      toast.error(t('errors.invalidCredentials'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      <ParticleBackground />

      <motion.div
        variants={scaleIn}
        initial="initial"
        animate="animate"
        className="relative z-10 w-full max-w-md px-4"
      >
        <div className="glass-card rounded-2xl p-8 shadow-card">
          {/* Logo */}
          <motion.div variants={fadeInUp} className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-glow-sm">
              <span className="text-lg font-bold text-primary-foreground">P</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {t('login.title')}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{t('login.subtitle')}</p>
          </motion.div>

          {/* OAuth buttons */}
          <motion.div variants={fadeInUp} className="mb-6 grid grid-cols-2 gap-3">
            <Button variant="outline" type="button" className="gap-2" disabled={isLoading}>
              <Chrome className="h-4 w-4" />
              Google
            </Button>
            <Button variant="outline" type="button" className="gap-2" disabled={isLoading}>
              <Github className="h-4 w-4" />
              GitHub
            </Button>
          </motion.div>

          <div className="relative mb-6">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
              {t('login.orContinueWith')}
            </span>
          </div>

          {/* Form */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <motion.div variants={fadeInUp} className="space-y-2">
              <Label htmlFor="email">{t('fields.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                autoComplete="email"
                {...form.register('email')}
              />
              {form.formState.errors.email && (
                <p className="text-xs text-destructive">
                  {t('errors.invalidEmail')}
                </p>
              )}
            </motion.div>

            <motion.div variants={fadeInUp} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t('fields.password')}</Label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  {t('login.forgotPassword')}
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="pr-10"
                  {...form.register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-xs text-destructive">
                  {t('errors.passwordTooShort')}
                </p>
              )}
            </motion.div>

            <motion.div variants={fadeInUp} className="flex items-center gap-2">
              <Checkbox
                id="rememberMe"
                {...form.register('rememberMe')}
              />
              <Label htmlFor="rememberMe" className="cursor-pointer text-sm font-normal">
                {t('login.rememberMe')}
              </Label>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('login.submit')}
              </Button>
            </motion.div>
          </form>

          <motion.p variants={fadeInUp} className="mt-6 text-center text-sm text-muted-foreground">
            {t('login.noAccount')}{' '}
            <Link to="/register" className="font-medium text-primary hover:underline">
              {t('login.createAccount')}
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  )
}
