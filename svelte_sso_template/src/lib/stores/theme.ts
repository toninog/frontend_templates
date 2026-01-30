import { writable } from 'svelte/store'
import { browser } from '$app/environment'
import type { Theme } from '$lib/types'
import config from '$lib/config'

/**
 * Theme Store - Manages light/dark theme state
 *
 * Features:
 * - Persists theme preference to localStorage
 * - Detects system theme preference on first load
 * - Applies 'dark' class to <html> element for Tailwind dark mode
 */

function getInitialTheme(): Theme {
  if (!browser) return config.theme.defaultTheme as Theme

  // Check localStorage first
  const savedTheme = localStorage.getItem(config.theme.storageKey) as Theme | null
  if (savedTheme) {
    return savedTheme
  }

  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }

  // Fall back to config default
  return config.theme.defaultTheme as Theme
}

function createThemeStore() {
  const { subscribe, set, update } = writable<Theme>(getInitialTheme())

  // Apply theme to document element and sync with localStorage
  function applyTheme(theme: Theme) {
    if (browser) {
      const root = window.document.documentElement
      root.classList.remove('light', 'dark')
      root.classList.add(theme)
      localStorage.setItem(config.theme.storageKey, theme)
    }
  }

  // Listen for system theme changes
  if (browser) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (e: MediaQueryEvent | MediaQueryListEvent) => {
      // Only update if user hasn't set a preference
      const savedTheme = localStorage.getItem(config.theme.storageKey)
      if (!savedTheme) {
        const newTheme = e.matches ? 'dark' : 'light'
        set(newTheme)
        applyTheme(newTheme)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
  }

  // Apply initial theme
  const initialTheme = getInitialTheme()
  applyTheme(initialTheme)

  return {
    subscribe,
    setTheme: (theme: Theme) => {
      set(theme)
      applyTheme(theme)
    },
    toggleTheme: () => {
      update((currentTheme) => {
        const newTheme = currentTheme === 'light' ? 'dark' : 'light'
        applyTheme(newTheme)
        return newTheme
      })
    },
  }
}

export const theme = createThemeStore()
