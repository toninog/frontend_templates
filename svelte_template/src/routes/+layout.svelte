<script lang="ts">
  import { page } from '$app/stores'
  import { isAuthenticated } from '$lib/stores/auth'
  import Navigation from '$lib/components/Navigation.svelte'
  import '../app.css'

  /**
   * Root Layout - Wrapper for all pages
   *
   * Conditionally shows navigation when authenticated
   * Loads global styles
   */

  // Pages that don't need navigation
  const publicPages = ['/login', '/register']
  $: showNav = $isAuthenticated && !publicPages.includes($page.url.pathname)
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
  {#if showNav}
    <Navigation />
  {/if}
  <slot />
</div>
