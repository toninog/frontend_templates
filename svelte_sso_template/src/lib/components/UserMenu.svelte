<script lang="ts">
  import { onMount } from 'svelte'
  import { goto } from '$app/navigation'
  import { LogOut, Settings } from 'lucide-svelte'
  import { auth, user } from '$lib/stores/auth'
  import config from '$lib/config'

  /**
   * UserMenu - Dropdown menu for user actions
   *
   * Displays user info and provides options to navigate to profile or logout.
   */

  let isOpen = false
  let menuRef: HTMLDivElement

  // Close menu when clicking outside
  function handleClickOutside(event: MouseEvent) {
    if (menuRef && !menuRef.contains(event.target as Node)) {
      isOpen = false
    }
  }

  $: if (isOpen) {
    document.addEventListener('mousedown', handleClickOutside)
  } else {
    document.removeEventListener('mousedown', handleClickOutside)
  }

  onMount(() => {
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  })

  function handleLogout() {
    auth.logout()
    goto('/')
    isOpen = false
  }

  function handleProfile() {
    goto(config.routes.profile)
    isOpen = false
  }
</script>

{#if $user}
  <div class="relative" bind:this={menuRef}>
    <button
      on:click={() => (isOpen = !isOpen)}
      class="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
      aria-label="User menu"
    >
      <div
        class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium"
      >
        {$user.name.charAt(0).toUpperCase()}
      </div>
      <span class="text-sm font-medium text-gray-900 dark:text-gray-100 hidden md:block">
        {$user.name}
      </span>
    </button>

    {#if isOpen}
      <div
        class="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
      >
        <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <p class="text-sm font-medium text-gray-900 dark:text-white">
            {$user.display_name || $user.name}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{$user.email}</p>
          <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">Role: {$user.role}</p>
        </div>

        <button
          on:click={handleProfile}
          class="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <Settings class="w-4 h-4 mr-3" />
          Profile Settings
        </button>

        <button
          on:click={handleLogout}
          class="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <LogOut class="w-4 h-4 mr-3" />
          Logout
        </button>
      </div>
    {/if}
  </div>
{/if}
