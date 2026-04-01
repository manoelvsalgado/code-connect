import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../features/auth/auth-context'
import type { ReactNode } from 'react'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <p className="p-6 text-sm text-neutral-600">Loading session...</p>
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />
  }

  return children
}
