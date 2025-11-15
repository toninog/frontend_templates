import { writable, derived, get } from 'svelte/store'
import { browser } from '$app/environment'
import type { User, LoginCredentials, RegisterData } from '$lib/types'
import config from '$lib/config'

/**
 * Auth Store - Manages authentication state with mock authentication
 *
 * TODO: Replace mock authentication with real API calls
 * This implementation uses localStorage to simulate a backend.
 * In production, replace with actual API integration.
 */

// Internal stores
const userStore = writable<User | null>(null)
const loadingStore = writable<boolean>(true)

// Initialize auth state from localStorage
if (browser) {
  const token = localStorage.getItem(config.auth.tokenStorageKey)
  const userData = localStorage.getItem(config.auth.userStorageKey)

  if (token && userData) {
    try {
      const parsedUser = JSON.parse(userData)
      userStore.set(parsedUser)
    } catch (error) {
      console.error('Failed to parse user data:', error)
      localStorage.removeItem(config.auth.tokenStorageKey)
      localStorage.removeItem(config.auth.userStorageKey)
    }
  }

  loadingStore.set(false)
}

// Derived stores
export const user = { subscribe: userStore.subscribe }
export const isLoading = { subscribe: loadingStore.subscribe }
export const isAuthenticated = derived(userStore, ($user) => !!$user)

/**
 * Mock login function
 * TODO: Replace with actual API call to your backend
 *
 * Current behavior:
 * - Accepts any email/password combination
 * - Creates a mock user object
 * - Stores token and user data in localStorage
 */
export async function login(credentials: LoginCredentials): Promise<void> {
  loadingStore.set(true)

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // TODO: Replace this with actual API call
  // Example:
  // const response = await api.auth.login(credentials)
  // const { token, user } = response.data

  // Mock authentication - accepts any credentials
  const mockUser: User = {
    id: 'user-' + Date.now(),
    email: credentials.email,
    name: credentials.email.split('@')[0],
    role: credentials.email.includes('admin') ? 'admin' : 'user',
    createdAt: new Date().toISOString(),
  }

  const mockToken = 'mock-jwt-token-' + Date.now()

  // Store in localStorage
  if (browser) {
    localStorage.setItem(config.auth.tokenStorageKey, mockToken)
    localStorage.setItem(config.auth.userStorageKey, JSON.stringify(mockUser))
  }

  userStore.set(mockUser)
  loadingStore.set(false)
}

/**
 * Mock register function
 * TODO: Replace with actual API call to your backend
 *
 * Current behavior:
 * - Accepts any registration data
 * - Creates a mock user object
 * - Automatically logs in the user
 */
export async function register(data: RegisterData): Promise<void> {
  loadingStore.set(true)

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // TODO: Replace this with actual API call
  // Example:
  // const response = await api.auth.register(data)
  // const { token, user } = response.data

  // Mock registration
  const mockUser: User = {
    id: 'user-' + Date.now(),
    email: data.email,
    name: data.name,
    role: 'user',
    createdAt: new Date().toISOString(),
  }

  const mockToken = 'mock-jwt-token-' + Date.now()

  // Store in localStorage
  if (browser) {
    localStorage.setItem(config.auth.tokenStorageKey, mockToken)
    localStorage.setItem(config.auth.userStorageKey, JSON.stringify(mockUser))
  }

  userStore.set(mockUser)
  loadingStore.set(false)
}

/**
 * Logout function
 * Clears authentication state and localStorage
 */
export function logout(): void {
  userStore.set(null)
  if (browser) {
    localStorage.removeItem(config.auth.tokenStorageKey)
    localStorage.removeItem(config.auth.userStorageKey)
  }
}

// Export a convenience object for easy importing
export const auth = {
  user,
  isAuthenticated,
  isLoading,
  login,
  register,
  logout,
}
