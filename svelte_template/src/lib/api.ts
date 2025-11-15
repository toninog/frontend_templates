import axios, { AxiosInstance } from 'axios'
import config from '$lib/config'
import { goto } from '$app/navigation'
import { browser } from '$app/environment'

/**
 * API Client
 *
 * Centralized HTTP client with Axios.
 * TODO: Replace mock responses with real API calls to your backend.
 *
 * Features:
 * - Automatic JWT token injection
 * - Request/response interceptors
 * - Error handling
 * - Token refresh support (placeholder)
 */

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: config.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
})

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    if (browser) {
      const token = localStorage.getItem('auth_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // TODO: Implement token refresh logic
      // Example:
      // try {
      //   const refreshToken = localStorage.getItem('refresh_token')
      //   const response = await axios.post('/api/auth/refresh', { refreshToken })
      //   const { token } = response.data
      //   localStorage.setItem('auth_token', token)
      //   originalRequest.headers.Authorization = `Bearer ${token}`
      //   return apiClient(originalRequest)
      // } catch (refreshError) {
      //   // Redirect to login
      //   if (browser) goto('/login')
      //   return Promise.reject(refreshError)
      // }

      // For now, just redirect to login
      if (browser) goto('/login')
    }

    return Promise.reject(error)
  }
)

/**
 * API Service
 *
 * Collection of API methods organized by domain.
 * TODO: Replace these mock implementations with real API calls.
 */
export const api = {
  // Authentication
  auth: {
    login: async (email: string, _password: string) => {
      // TODO: Replace with real API call
      // return apiClient.post('/auth/login', { email, password })
      return Promise.resolve({
        data: {
          token: 'mock-jwt-token',
          user: { id: '1', email, name: email.split('@')[0], role: 'user' },
        },
      })
    },

    register: async (name: string, email: string, _password: string) => {
      // TODO: Replace with real API call
      // return apiClient.post('/auth/register', { name, email, password })
      return Promise.resolve({
        data: {
          token: 'mock-jwt-token',
          user: { id: '1', email, name, role: 'user' },
        },
      })
    },

    getCurrentUser: async () => {
      // TODO: Replace with real API call
      // return apiClient.get('/auth/me')
      if (browser) {
        const userData = localStorage.getItem('user_data')
        return Promise.resolve({
          data: userData ? JSON.parse(userData) : null,
        })
      }
      return Promise.resolve({ data: null })
    },

    logout: async () => {
      // TODO: Replace with real API call
      // return apiClient.post('/auth/logout')
      return Promise.resolve({ data: { success: true } })
    },
  },

  // Users
  users: {
    getAll: async () => {
      // TODO: Replace with real API call
      // return apiClient.get('/users')
      return Promise.resolve({
        data: [
          { id: '1', name: 'John Doe', email: 'john@example.com', role: 'user' },
          { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'admin' },
        ],
      })
    },

    getById: async (id: string) => {
      // TODO: Replace with real API call
      // return apiClient.get(`/users/${id}`)
      return Promise.resolve({
        data: { id, name: 'John Doe', email: 'john@example.com', role: 'user' },
      })
    },

    update: async (_id: string, data: any) => {
      // TODO: Replace with real API call
      // return apiClient.put(`/users/${id}`, data)
      return Promise.resolve({
        data: { id: _id, ...data },
      })
    },

    delete: async (_id: string) => {
      // TODO: Replace with real API call
      // return apiClient.delete(`/users/${id}`)
      return Promise.resolve({
        data: { success: true },
      })
    },
  },

  // TODO: Add more API domains as needed
  // Example:
  // items: {
  //   getAll: () => apiClient.get('/items'),
  //   getById: (id: string) => apiClient.get(`/items/${id}`),
  //   create: (data: any) => apiClient.post('/items', data),
  //   update: (id: string, data: any) => apiClient.put(`/items/${id}`, data),
  //   delete: (id: string) => apiClient.delete(`/items/${id}`),
  // },
}

export default apiClient
