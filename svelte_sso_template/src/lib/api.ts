/**
 * API Client for Microsoft EntraID SSO Template
 *
 * This client handles all HTTP communication with the backend API.
 * It supports OAuth 2.0 authentication flow and JWT token management.
 */

import config from '$lib/config';
import type { User } from '$lib/types';

class ApiClient {
	private baseUrl: string;
	public token: string | null = null;

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
	}

	/**
	 * Set the authentication token
	 */
	setToken(token: string | null) {
		this.token = token;
	}

	/**
	 * Generic request method
	 */
	private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
		const url = `${this.baseUrl}${endpoint}`;
		const headers: HeadersInit = {
			'Content-Type': 'application/json',
			...options.headers
		};

		// Add JWT token to requests if available
		if (this.token) {
			(headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
		}

		const response = await fetch(url, {
			...options,
			headers
		});

		if (!response.ok) {
			const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
			throw new Error(error.detail || `HTTP ${response.status}`);
		}

		// Handle no content responses
		if (response.status === 204) {
			return {} as T;
		}

		return response.json();
	}

	// ==================== Auth Endpoints ====================

	/**
	 * Initiate OAuth login flow
	 * Returns the Microsoft authorization URL
	 */
	async login(redirectUri: string): Promise<{ authorization_url: string }> {
		return this.request('/auth/login', {
			method: 'POST',
			body: JSON.stringify({ redirect_uri: redirectUri })
		});
	}

	/**
	 * Handle OAuth callback
	 * Exchange authorization code for JWT token
	 */
	async callback(
		code: string,
		state?: string
	): Promise<{ access_token: string; token_type: string; expires_in: number }> {
		const params = new URLSearchParams({ code });
		if (state) params.append('state', state);
		return this.request(`/auth/callback?${params.toString()}`);
	}

	/**
	 * Refresh JWT token
	 */
	async refreshToken(): Promise<{ access_token: string; token_type: string; expires_in: number }> {
		return this.request('/auth/refresh', { method: 'POST' });
	}

	/**
	 * Get current authenticated user
	 */
	async getCurrentUser(): Promise<User> {
		return this.request('/auth/me');
	}

	/**
	 * Logout user (optional backend endpoint)
	 */
	async logout(): Promise<void> {
		return this.request('/auth/logout', { method: 'POST' });
	}

	// ==================== User Management Endpoints ====================

	/**
	 * Get all users (admin only)
	 */
	async getUsers(): Promise<User[]> {
		return this.request('/users');
	}

	/**
	 * Get user by ID
	 */
	async getUserById(id: string | number): Promise<User> {
		return this.request(`/users/${id}`);
	}

	/**
	 * Update user
	 */
	async updateUser(id: string | number, data: Partial<User>): Promise<User> {
		return this.request(`/users/${id}`, {
			method: 'PUT',
			body: JSON.stringify(data)
		});
	}

	/**
	 * Delete user (admin only)
	 */
	async deleteUser(id: string | number): Promise<void> {
		return this.request(`/users/${id}`, { method: 'DELETE' });
	}

	// ==================== Add more endpoints as needed ====================

	// Example: Items endpoint
	// async getItems(): Promise<Item[]> {
	//   return this.request('/items');
	// }
	//
	// async createItem(data: Partial<Item>): Promise<Item> {
	//   return this.request('/items', {
	//     method: 'POST',
	//     body: JSON.stringify(data)
	//   });
	// }
}

// Export singleton instance
export const api = new ApiClient(config.apiBaseUrl);
