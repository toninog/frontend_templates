<script lang="ts">
  import { page } from '$app/stores'
  import { Home, LayoutDashboard } from 'lucide-svelte'
  import UserMenu from './UserMenu.svelte'
  import ThemeToggle from './ThemeToggle.svelte'
  import config from '$lib/config'
  import clsx from 'clsx'

  /**
   * Navigation - Main navigation bar component
   *
   * Displays app logo, navigation links, theme toggle, and user menu.
   * TODO: Update logo and add/remove navigation links as needed.
   */

  function isActive(path: string): boolean {
    return $page.url.pathname === path
  }
</script>

<nav class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
  <div class="container mx-auto px-4">
    <div class="flex items-center justify-between h-16">
      <!-- Logo and Brand -->
      <div class="flex items-center space-x-8">
        <a
          href={config.routes.home}
          class="flex items-center space-x-2 text-xl font-bold text-gray-900 dark:text-white"
        >
          <!-- TODO: Replace with your own logo -->
          <div
            class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold"
          >
            {config.appName.charAt(0)}
          </div>
          <span>{config.appName}</span>
        </a>

        <!-- Navigation Links -->
        <div class="hidden md:flex items-center space-x-1">
          <a
            href={config.routes.home}
            class={clsx(
              'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
              isActive(config.routes.home)
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            )}
          >
            <Home class="w-4 h-4" />
            <span>Home</span>
          </a>

          <a
            href={config.routes.dashboard}
            class={clsx(
              'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
              isActive(config.routes.dashboard)
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            )}
          >
            <LayoutDashboard class="w-4 h-4" />
            <span>Dashboard</span>
          </a>

          <!-- TODO: Add more navigation links here -->
        </div>
      </div>

      <!-- Right side: Theme toggle and User menu -->
      <div class="flex items-center space-x-3">
        <ThemeToggle />
        <UserMenu />
      </div>
    </div>
  </div>
</nav>
