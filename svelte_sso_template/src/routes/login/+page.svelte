<script lang="ts">
  import { goto } from '$app/navigation'
  import { LogIn } from 'lucide-svelte'
  import { auth, isAuthenticated } from '$lib/stores/auth'
  import config from '$lib/config'

  /**
   * Login Page
   *
   * Mock authentication - accepts any email/password.
   * TODO: Update with real authentication logic.
   *
   * TIP: Use email with 'admin' in it to get admin role (e.g., admin@example.com)
   */

  let email = ''
  let password = ''
  let error = ''
  let isLoading = false

  // Redirect if already authenticated
  $: if ($isAuthenticated) {
    goto(config.routes.home)
  }

  async function handleSubmit(e: Event) {
    e.preventDefault()
    error = ''
    isLoading = true

    try {
      await auth.login()
      goto(config.routes.home)
    } catch (err) {
      error = 'Login failed. Please try again.'
      console.error('Login error:', err)
    } finally {
      isLoading = false
    }
  }
</script>

<div class="page-container flex items-center justify-center">
  <div class="w-full max-w-md px-4">
    <div class="card">
      <!-- Header -->
      <div class="text-center mb-8">
        <div
          class="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4"
        >
          <LogIn class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{config.appName}</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">Sign in to your account</p>
      </div>

      <!-- Mock Auth Info -->
      <div
        class="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
      >
        <p class="text-sm text-blue-800 dark:text-blue-300 font-medium mb-2">
          Mock Authentication Active
        </p>
        <p class="text-xs text-blue-700 dark:text-blue-400">
          Enter any email and password to login. Use 'admin@example.com' for admin role.
        </p>
      </div>

      <!-- Error Message -->
      {#if error}
        <div
          class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
        >
          <p class="text-sm text-red-800 dark:text-red-300">{error}</p>
        </div>
      {/if}

      <!-- Login Form -->
      <form on:submit={handleSubmit} class="space-y-4">
        <div>
          <label
            for="email"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            bind:value={email}
            class="input-field"
            placeholder="you@example.com"
            required
            autocomplete="email"
          />
        </div>

        <div>
          <label
            for="password"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            bind:value={password}
            class="input-field"
            placeholder="••••••••"
            required
            autocomplete="current-password"
          />
        </div>

        <button type="submit" disabled={isLoading} class="w-full btn-primary">
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <!-- Register Link -->
      {#if config.features.enableRegistration}
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?
            <a
              href={config.routes.register}
              class="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Sign up
            </a>
          </p>
        </div>
      {/if}
    </div>

    <!-- Footer -->
    <p class="text-center text-xs text-gray-500 dark:text-gray-400 mt-8">
      &copy; {new Date().getFullYear()} {config.companyName}. All rights reserved.
    </p>
  </div>
</div>
