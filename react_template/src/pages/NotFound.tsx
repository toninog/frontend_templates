import { useNavigate } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'
import config from '@/config'

/**
 * NotFound Page (404)
 *
 * Displayed when a user navigates to a non-existent route.
 */
export function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="page-container flex items-center justify-center">
      <div className="text-center px-4">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-blue-600 dark:text-blue-400">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">Page Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => navigate(-1)} className="btn-secondary inline-flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
          <button onClick={() => navigate(config.routes.home)} className="btn-primary inline-flex items-center justify-center">
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </button>
        </div>

        {/* Decorative illustration */}
        <div className="mt-12 text-gray-300 dark:text-gray-700">
          <svg
            className="w-64 h-64 mx-auto"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2L2 7L12 12L22 7L12 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 17L12 22L22 17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 12L12 17L22 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}
