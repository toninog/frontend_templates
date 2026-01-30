/**
 * Application Configuration
 *
 * Centralized configuration file for easy customization.
 * Update these values to customize your application.
 */

export const config = {
	// TODO: Set your application name
	appName: 'SSO App',

	// TODO: Set your application description
	appDescription: 'A SvelteKit SSO starter template with Microsoft EntraID authentication',

	// TODO: Set your company/organization name
	companyName: 'Example Inc',

	// TODO: Set your logo path (place your logo in /static folder)
	logoPath: '/logo.svg',

	// TODO: Configure your primary brand color
	primaryColor: '#3b82f6', // Tailwind blue-500

	// TODO: Set your API base URL (or use environment variable)
	apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api/v1',

	// Azure AD configuration
	azure: {
		clientId: import.meta.env.VITE_AZURE_CLIENT_ID || '',
		tenantId: import.meta.env.VITE_AZURE_TENANT_ID || '',
		redirectUri:
			import.meta.env.VITE_AZURE_REDIRECT_URI ||
			`${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`
	},

	// TODO: Configure authentication settings
	auth: {
		// Token expiration time in milliseconds (default: 24 hours)
		tokenExpirationTime: 24 * 60 * 60 * 1000,

		// Storage key for auth token
		tokenStorageKey: 'sso_token',

		// Storage key for user data
		userStorageKey: 'sso_user'
	},

	// TODO: Configure theme settings
	theme: {
		// Default theme (can be 'light' or 'dark')
		defaultTheme: 'light',

		// Storage key for theme preference
		storageKey: 'theme_preference'
	},

	// TODO: Configure routing paths
	routes: {
		home: '/',
		login: '/', // Home page is the login page for SSO
		callback: '/auth/callback',
		dashboard: '/dashboard',
		profile: '/profile'
	},

	// TODO: Configure feature flags
	features: {
		// Registration not available for SSO (users must be in Azure AD)
		enableRegistration: false,

		// Enable/disable dark mode toggle
		enableDarkMode: true,

		// SSO provider
		ssoProvider: 'microsoft'
	}
};

export default config;
