import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import config from '@/config'

interface ProtectedRouteProps {
  children: React.ReactNode
}

/**
 * ProtectedRoute - Route guard for authenticated users
 *
 * Redirects to login page if user is not authenticated.
 * Shows loading state while checking authentication status.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={config.routes.login} replace />
  }

  return <>{children}</>
}
