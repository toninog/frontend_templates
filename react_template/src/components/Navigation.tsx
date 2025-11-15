import { Link, useLocation } from 'react-router-dom'
import { Home, LayoutDashboard } from 'lucide-react'
import { UserMenu } from './UserMenu'
import { ThemeToggle } from './ThemeToggle'
import config from '@/config'
import clsx from 'clsx'

/**
 * Navigation - Main navigation bar component
 *
 * Displays app logo, navigation links, theme toggle, and user menu.
 * TODO: Update logo and add/remove navigation links as needed.
 */
export function Navigation() {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-8">
            <Link
              to={config.routes.home}
              className="flex items-center space-x-2 text-xl font-bold text-gray-900 dark:text-white"
            >
              {/* TODO: Replace with your own logo */}
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                {config.appName.charAt(0)}
              </div>
              <span>{config.appName}</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              <Link
                to={config.routes.home}
                className={clsx(
                  'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
                  isActive(config.routes.home)
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                )}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>

              <Link
                to={config.routes.dashboard}
                className={clsx(
                  'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
                  isActive(config.routes.dashboard)
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                )}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>

              {/* TODO: Add more navigation links here */}
            </div>
          </div>

          {/* Right side: Theme toggle and User menu */}
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  )
}
