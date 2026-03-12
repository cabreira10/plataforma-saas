import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { Providers } from './providers'
import { ErrorBoundary } from '@/shared/components/feedback/ErrorBoundary'

export function App() {
  return (
    <ErrorBoundary>
      <Providers>
        <RouterProvider router={router} />
      </Providers>
    </ErrorBoundary>
  )
}
