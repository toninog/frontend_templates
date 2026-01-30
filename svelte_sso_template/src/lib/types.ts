/**
 * Type Definitions
 *
 * Central location for all TypeScript types and interfaces.
 * TODO: Add your own custom types as your application grows.
 */

// User related types
export interface User {
	id: string | number;
	email: string;
	name: string;
	display_name?: string; // Microsoft display name
	role: 'admin' | 'user' | 'manager'; // Group-based roles
	createdAt?: string;
	azure_oid?: string; // Azure AD object ID
	is_active?: boolean;
}

// OAuth related types
export interface OAuthCallbackParams {
	code: string;
	state?: string;
	error?: string;
	error_description?: string;
}

export interface AuthState {
	user: User | null;
	token: string | null;
	loading: boolean;
	error: string | null;
}

export interface AuthResponse {
	access_token: string;
	token_type: string;
	expires_in: number;
}

// API related types
export interface ApiError {
	message: string;
	code?: string;
	status?: number;
}

// Example domain types - TODO: Replace with your own domain models
export interface ExampleItem {
	id: string;
	title: string;
	description: string;
	status: 'active' | 'inactive';
	createdAt: string;
	updatedAt: string;
}

export interface DashboardStats {
	totalUsers: number;
	activeUsers: number;
	totalItems: number;
	recentActivity: ActivityItem[];
}

export interface ActivityItem {
	id: string;
	type: 'created' | 'updated' | 'deleted';
	description: string;
	timestamp: string;
}

// Theme types
export type Theme = 'light' | 'dark';
