/**
 * Type Definitions
 *
 * Central location for all TypeScript types and interfaces.
 * TODO: Add your own custom types as your application grows.
 */

// User related types
export interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'admin'
  createdAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
}

// API related types
export interface ApiError {
  message: string
  code?: string
  status?: number
}

// Example domain types - TODO: Replace with your own domain models
export interface ExampleItem {
  id: string
  title: string
  description: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalItems: number
  recentActivity: ActivityItem[]
}

export interface ActivityItem {
  id: string
  type: 'created' | 'updated' | 'deleted'
  description: string
  timestamp: string
}

// Theme types
export type Theme = 'light' | 'dark'
