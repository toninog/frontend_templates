import { User, Mail, Calendar, Shield } from 'lucide-react'
import { Card } from '@/components/Card'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import config from '@/config'

/**
 * Profile Page
 *
 * Displays user profile information and preferences.
 * TODO: Add functionality to edit profile, change password, etc.
 */
export function Profile() {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()

  if (!user) {
    return null
  }

  return (
    <div className="page-container">
      <div className="page-content max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your account settings and preferences</p>
        </div>

        {/* Profile Information */}
        <Card title="Profile Information" className="mb-6">
          <div className="flex items-center space-x-6 mb-6">
            <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{user.name}</h3>
              <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Name</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <Shield className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Role</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{user.role}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Member Since</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* TODO: Add edit profile functionality */}
          <div className="mt-6 flex space-x-3">
            <button className="btn-primary" disabled>
              Edit Profile
            </button>
            <button className="btn-secondary" disabled>
              Change Password
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            TODO: Implement profile editing functionality
          </p>
        </Card>

        {/* Preferences */}
        <Card title="Preferences" description="Customize your experience">
          <div className="space-y-4">
            {/* Theme Toggle */}
            {config.features.enableDarkMode && (
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Dark Mode</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Toggle between light and dark theme</p>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            )}

            {/* More preference options - TODO: Add more preferences */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg opacity-50">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Email Notifications</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Receive email updates</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300" disabled>
                <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
              </button>
            </div>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card title="Danger Zone" className="border-red-200 dark:border-red-800">
          <div className="space-y-3">
            <button className="w-full px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors font-medium" disabled>
              Delete Account
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              TODO: Implement account deletion with confirmation
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
