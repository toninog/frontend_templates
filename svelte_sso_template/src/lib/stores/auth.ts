/**
 * Auth Store - Manages Microsoft EntraID SSO authentication
 *
 * This store handles OAuth 2.0 Authorization Code flow with Microsoft EntraID.
 * It manages user authentication state, token storage, and OAuth callbacks.
 */

import { writable, derived } from 'svelte/store';
import type { User } from '$lib/types';
import { api } from '$lib/api';
import { browser } from '$app/environment';
import config from '$lib/config';

const TOKEN_KEY = config.auth.tokenStorageKey;

interface AuthState {
	user: User | null;
	token: string | null;
	loading: boolean;
	error: string | null;
}

function createAuthStore() {
	const initialToken = browser ? localStorage.getItem(TOKEN_KEY) : null;

	const { subscribe, set, update } = writable<AuthState>({
		user: null,
		token: initialToken,
		loading: false,
		error: null
	});

	// Set token in API client if exists
	if (initialToken) {
		api.setToken(initialToken);
	}

	return {
		subscribe,

		/**
		 * Initialize auth state on app startup
		 * Loads token from localStorage and fetches current user
		 */
		async initialize() {
			const token = browser ? localStorage.getItem(TOKEN_KEY) : null;
			if (!token) {
				set({ user: null, token: null, loading: false, error: null });
				return;
			}

			update((state) => ({ ...state, loading: true }));
			api.setToken(token);

			try {
				const user = await api.getCurrentUser();
				set({ user, token, loading: false, error: null });
			} catch (error) {
				// Token is invalid
				if (browser) localStorage.removeItem(TOKEN_KEY);
				api.setToken(null);
				set({ user: null, token: null, loading: false, error: null });
			}
		},

		/**
		 * Initiate Microsoft SSO login flow
		 * Redirects user to Microsoft login page
		 */
		async login() {
			update((state) => ({ ...state, loading: true, error: null }));

			try {
				const redirectUri = `${window.location.origin}/auth/callback`;
				const { authorization_url } = await api.login(redirectUri);
				window.location.href = authorization_url;
			} catch (error) {
				update((state) => ({
					...state,
					loading: false,
					error: error instanceof Error ? error.message : 'Login failed'
				}));
			}
		},

		/**
		 * Handle OAuth callback after Microsoft authentication
		 * Exchanges authorization code for JWT token
		 */
		async handleCallback(code: string, state?: string) {
			update((s) => ({ ...s, loading: true, error: null }));

			try {
				const { access_token } = await api.callback(code, state);

				if (browser) {
					localStorage.setItem(TOKEN_KEY, access_token);
				}
				api.setToken(access_token);

				const user = await api.getCurrentUser();
				set({ user, token: access_token, loading: false, error: null });

				return true;
			} catch (error) {
				update((s) => ({
					...s,
					loading: false,
					error: error instanceof Error ? error.message : 'Authentication failed'
				}));
				return false;
			}
		},

		/**
		 * Refresh the JWT token
		 * Called when token is about to expire
		 */
		async refreshToken() {
			try {
				const { access_token } = await api.refreshToken();

				if (browser) {
					localStorage.setItem(TOKEN_KEY, access_token);
				}
				api.setToken(access_token);

				update((state) => ({ ...state, token: access_token }));
				return true;
			} catch {
				this.logout();
				return false;
			}
		},

		/**
		 * Logout user
		 * Clears token and user data from localStorage
		 */
		logout() {
			if (browser) {
				localStorage.removeItem(TOKEN_KEY);
			}
			api.setToken(null);
			set({ user: null, token: null, loading: false, error: null });
		},

		/**
		 * Clear authentication error
		 */
		clearError() {
			update((state) => ({ ...state, error: null }));
		}
	};
}

export const auth = createAuthStore();

// Derived stores for convenience
export const user = derived(auth, ($auth) => $auth.user);
export const isAuthenticated = derived(auth, ($auth) => !!$auth.user && !!$auth.token);
export const isLoading = derived(auth, ($auth) => $auth.loading);
export const authError = derived(auth, ($auth) => $auth.error);

// Role check helpers
export const isAdmin = derived(user, ($user) => $user?.role === 'admin');
export const isManager = derived(user, ($user) => $user?.role === 'manager');
export const isUser = derived(user, ($user) => $user?.role === 'user');

/**
 * Check if user has specific role(s)
 */
export function hasRole(user: User | null, ...roles: ('admin' | 'user' | 'manager')[]): boolean {
	if (!user) return false;
	return roles.includes(user.role);
}
