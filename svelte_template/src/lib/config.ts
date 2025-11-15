/**
 * Application Configuration
 *
 * Centralized configuration file for easy customization.
 * Update these values to customize your application.
 */

export const config = {
  // TODO: Set your application name
  appName: 'My App',

  // TODO: Set your application description
  appDescription: 'A SvelteKit starter template with authentication and routing',

  // TODO: Set your company/organization name
  companyName: 'Example Inc',

  // TODO: Set your logo path (place your logo in /static folder)
  logoPath: '/logo.svg',

  // TODO: Configure your primary brand color
  primaryColor: '#3b82f6', // Tailwind blue-500

  // TODO: Set your API base URL (or use environment variable)
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',

  // TODO: Configure authentication settings
  auth: {
    // Token expiration time in milliseconds (default: 24 hours)
    tokenExpirationTime: 24 * 60 * 60 * 1000,

    // Storage key for auth token
    tokenStorageKey: 'auth_token',

    // Storage key for user data
    userStorageKey: 'user_data',
  },

  // TODO: Configure theme settings
  theme: {
    // Default theme (can be 'light' or 'dark')
    defaultTheme: 'light',

    // Storage key for theme preference
    storageKey: 'theme_preference',
  },

  // TODO: Configure routing paths
  routes: {
    home: '/',
    login: '/login',
    register: '/register',
    dashboard: '/dashboard',
    profile: '/profile',
  },

  // TODO: Configure feature flags
  features: {
    // Enable/disable user registration
    enableRegistration: true,

    // Enable/disable dark mode toggle
    enableDarkMode: true,
  },
}

export default config
