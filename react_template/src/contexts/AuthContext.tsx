import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, LoginCredentials, RegisterData } from '@/types'
import config from '@/config'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

/**
 * AuthProvider - Manages authentication state with mock authentication
 *
 * TODO: Replace mock authentication with real API calls
 * This implementation uses localStorage to simulate a backend.
 * In production, replace with actual API integration.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem(config.auth.tokenStorageKey)
    const userData = localStorage.getItem(config.auth.userStorageKey)

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
      } catch (error) {
        console.error('Failed to parse user data:', error)
        localStorage.removeItem(config.auth.tokenStorageKey)
        localStorage.removeItem(config.auth.userStorageKey)
      }
    }

    setIsLoading(false)
  }, [])

  /**
   * Mock login function
   * TODO: Replace with actual API call to your backend
   *
   * Current behavior:
   * - Accepts any email/password combination
   * - Creates a mock user object
   * - Stores token and user data in localStorage
   */
  const login = async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // TODO: Replace this with actual API call
    // Example:
    // const response = await api.login(credentials)
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
    localStorage.setItem(config.auth.tokenStorageKey, mockToken)
    localStorage.setItem(config.auth.userStorageKey, JSON.stringify(mockUser))

    setUser(mockUser)
    setIsLoading(false)
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
  const register = async (data: RegisterData): Promise<void> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // TODO: Replace this with actual API call
    // Example:
    // const response = await api.register(data)
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
    localStorage.setItem(config.auth.tokenStorageKey, mockToken)
    localStorage.setItem(config.auth.userStorageKey, JSON.stringify(mockUser))

    setUser(mockUser)
    setIsLoading(false)
  }

  /**
   * Logout function
   * Clears authentication state and localStorage
   */
  const logout = () => {
    setUser(null)
    localStorage.removeItem(config.auth.tokenStorageKey)
    localStorage.removeItem(config.auth.userStorageKey)
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
