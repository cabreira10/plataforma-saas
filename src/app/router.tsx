import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AuthenticatedLayout } from '@/shared/layouts/AuthenticatedLayout'
import { PublicLayout } from '@/shared/layouts/PublicLayout'
import { AuthGuard } from '@/shared/layouts/guards/AuthGuard'
import { WorkspaceGuard } from '@/shared/layouts/guards/WorkspaceGuard'
import { LoadingSkeleton } from '@/shared/components/feedback/LoadingSkeleton'

// Lazy-loaded pages
const LoginPage             = lazy(() => import('@features/auth').then(m => ({ default: m.LoginPage })))
const RegisterPage          = lazy(() => import('@features/auth').then(m => ({ default: m.RegisterPage })))
const ForgotPasswordPage    = lazy(() => import('@features/auth').then(m => ({ default: m.ForgotPasswordPage })))
const InviteAcceptPage      = lazy(() => import('@features/auth').then(m => ({ default: m.InviteAcceptPage })))
const WorkspaceSelectorPage = lazy(() => import('@features/workspaces').then(m => ({ default: m.WorkspaceSelectorPage })))
const CreateWorkspacePage   = lazy(() => import('@features/workspaces').then(m => ({ default: m.CreateWorkspacePage })))
const DashboardPage         = lazy(() => import('@features/dashboard'))
const CrmPage               = lazy(() => import('@features/crm'))
const ContractsPage         = lazy(() => import('@features/contracts'))
const InvoicesPage          = lazy(() => import('@features/invoices'))
const CheckoutPage          = lazy(() => import('@features/checkout'))
const LeadsCapturePage      = lazy(() => import('@features/leads-capture'))
const SchedulePage          = lazy(() => import('@features/schedule'))
const PaymentsPage          = lazy(() => import('@features/payments'))
const FollowUpPage          = lazy(() => import('@features/follow-up'))
const UsersPage             = lazy(() => import('@features/users'))
const BillingPage           = lazy(() => import('@features/billing'))
const SettingsPage          = lazy(() => import('@features/settings'))
const NotFoundPage          = lazy(() => import('@features/not-found'))

const withSuspense = (element: React.ReactNode) => (
  <Suspense fallback={<LoadingSkeleton />}>{element}</Suspense>
)

export const router = createBrowserRouter([
  // Public routes
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <Navigate to="/login" replace /> },
      { path: '/login', element: withSuspense(<LoginPage />) },
      { path: '/register', element: withSuspense(<RegisterPage />) },
      { path: '/forgot-password', element: withSuspense(<ForgotPasswordPage />) },
      { path: '/invite/:token', element: withSuspense(<InviteAcceptPage />) },
    ],
  },

  // Workspace selector (authenticated, no workspace required)
  {
    element: <AuthGuard />,
    children: [
      {
        path: '/workspaces',
        element: withSuspense(<WorkspaceSelectorPage />),
      },
      {
        path: '/workspaces/new',
        element: withSuspense(<CreateWorkspacePage />),
      },
    ],
  },

  // Authenticated + workspace routes
  {
    element: <AuthGuard />,
    children: [
      {
        element: <WorkspaceGuard />,
        children: [
          {
            path: '/app',
            element: <AuthenticatedLayout />,
            children: [
              { index: true, element: <Navigate to="dashboard" replace /> },
              { path: 'dashboard',  element: withSuspense(<DashboardPage />) },
              { path: 'crm',        element: withSuspense(<CrmPage />) },
              { path: 'contracts',  element: withSuspense(<ContractsPage />) },
              { path: 'invoices',   element: withSuspense(<InvoicesPage />) },
              { path: 'checkout',   element: withSuspense(<CheckoutPage />) },
              { path: 'leads',      element: withSuspense(<LeadsCapturePage />) },
              { path: 'schedule',   element: withSuspense(<SchedulePage />) },
              { path: 'payments',   element: withSuspense(<PaymentsPage />) },
              { path: 'follow-up',  element: withSuspense(<FollowUpPage />) },
              { path: 'users',      element: withSuspense(<UsersPage />) },
              { path: 'billing',    element: withSuspense(<BillingPage />) },
              { path: 'settings',   element: withSuspense(<SettingsPage />) },
            ],
          },
        ],
      },
    ],
  },

  // 404
  { path: '*', element: withSuspense(<NotFoundPage />) },
])
