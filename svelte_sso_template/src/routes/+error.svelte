<script lang="ts">
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'
  import { Home, ArrowLeft } from 'lucide-svelte'
  import config from '$lib/config'

  /**
   * Error Page (404)
   *
   * Displayed when a user navigates to a non-existent route or encounters an error.
   */
</script>

<div class="page-container flex items-center justify-center">
  <div class="text-center px-4">
    <div class="mb-8">
      <h1 class="text-9xl font-bold text-blue-600 dark:text-blue-400">
        {$page.status || 404}
      </h1>
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mt-4">
        {$page.status === 404 ? 'Page Not Found' : 'Something Went Wrong'}
      </h2>
      <p class="text-gray-600 dark:text-gray-400 mt-2 max-w-md mx-auto">
        {$page.error?.message || "The page you're looking for doesn't exist or has been moved."}
      </p>
    </div>

    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <button
        on:click={() => history.back()}
        class="btn-secondary inline-flex items-center justify-center"
      >
        <ArrowLeft class="w-4 h-4 mr-2" />
        Go Back
      </button>
      <button
        on:click={() => goto(config.routes.home)}
        class="btn-primary inline-flex items-center justify-center"
      >
        <Home class="w-4 h-4 mr-2" />
        Go Home
      </button>
    </div>

    <!-- Decorative illustration -->
    <div class="mt-12 text-gray-300 dark:text-gray-700">
      <svg class="w-64 h-64 mx-auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 2L2 7L12 12L22 7L12 2Z"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M2 17L12 22L22 17"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M2 12L12 17L22 12"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  </div>
</div>
