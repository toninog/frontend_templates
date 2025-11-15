<script lang="ts">
  import { Moon, Sun } from 'lucide-svelte'
  import { theme } from '$lib/stores/theme'

  /**
   * ThemeToggle - Button to toggle between light and dark themes
   *
   * Displays a sun icon in dark mode and moon icon in light mode.
   */
</script>

<button
  on:click={() => theme.toggleTheme()}
  class="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
  aria-label="Toggle theme"
  title={`Switch to ${$theme === 'light' ? 'dark' : 'light'} mode`}
>
  {#if $theme === 'light'}
    <Moon class="w-5 h-5 text-gray-700" />
  {:else}
    <Sun class="w-5 h-5 text-yellow-400" />
  {/if}
</button>
