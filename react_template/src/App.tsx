import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Navigation } from '@/components/Navigation'
import { useAuth } from '@/contexts/AuthContext'
import config from '@/config'

// Pages
import { Login } from '@/pages/Login'
import { Register } from '@/pages/Register'
import { Home } from '@/pages/Home'
import { Dashboard } from '@/pages/Dashboard'
import { Profile } from '@/pages/Profile'
import { NotFound } from '@/pages/NotFound'

/**
 * App Component
 *
 * Main application component with routing configuration.
 * TODO: Add your own routes as your application grows.
 */
function App() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Show navigation only when authenticated */}
      {isAuthenticated && <Navigation />}

      <Routes>
        {/* Public Routes */}
        <Route path={config.routes.login} element={<Login />} />
        {config.features.enableRegistration && (
          <Route path={config.routes.register} element={<Register />} />
        )}

        {/* Protected Routes */}
        <Route
          path={config.routes.home}
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path={config.routes.dashboard}
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path={config.routes.profile}
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* TODO: Add more routes here */}
        {/* Example:
        <Route
          path="/items"
          element={
            <ProtectedRoute>
              <ItemsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/items/:id"
          element={
            <ProtectedRoute>
              <ItemDetail />
            </ProtectedRoute>
          }
        />
        */}

        {/* Redirect root to home or login */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to={config.routes.home} replace />
            ) : (
              <Navigate to={config.routes.login} replace />
            )
          }
        />

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
