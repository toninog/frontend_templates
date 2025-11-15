<script lang="ts">
  import { goto } from '$app/navigation'
  import { UserPlus } from 'lucide-svelte'
  import { register, isAuthenticated } from '$lib/stores/auth'
  import config from '$lib/config'

  /**
   * Register Page
   *
   * Mock registration - accepts any data and creates a user.
   * TODO: Update with real registration logic and validation.
   */

  let name = ''
  let email = ''
  let password = ''
  let confirmPassword = ''
  let error = ''
  let isLoading = false

  // Redirect if already authenticated
  $: if ($isAuthenticated) {
    goto(config.routes.home)
  }

  async function handleSubmit(e: Event) {
    e.preventDefault()
    error = ''

    // Basic validation
    if (password !== confirmPassword) {
      error = 'Passwords do not match'
      return
    }

    if (password.length < 6) {
      error = 'Password must be at least 6 characters long'
      return
    }

    isLoading = true

    try {
      await register({ name, email, password })
      goto(config.routes.home)
    } catch (err) {
      error = 'Registration failed. Please try again.'
      console.error('Registration error:', err)
    } finally {
      isLoading = false
    }
  }
</script>

<div class="page-container flex items-center justify-center py-8">
  <div class="w-full max-w-md px-4">
    <div class="card">
      <!-- Header -->
      <div class="text-center mb-8">
        <div
          class="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4"
        >
          <UserPlus class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Create Account</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">Sign up for {config.appName}</p>
      </div>

      <!-- Mock Auth Info -->
      <div
        class="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
      >
        <p class="text-sm text-blue-800 dark:text-blue-300 font-medium mb-2">
          Mock Registration Active
        </p>
        <p class="text-xs text-blue-700 dark:text-blue-400">
          Enter any details to create an account. You will be automatically logged in.
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

      <!-- Register Form -->
      <form on:submit={handleSubmit} class="space-y-4">
        <div>
          <label
            for="name"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Full Name
          </label>
          <input
            id="name"
            type="text"
            bind:value={name}
            class="input-field"
            placeholder="John Doe"
            required
            autocomplete="name"
          />
        </div>

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
            autocomplete="new-password"
            minlength={6}
          />
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Minimum 6 characters</p>
        </div>

        <div>
          <label
            for="confirmPassword"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            bind:value={confirmPassword}
            class="input-field"
            placeholder="••••••••"
            required
            autocomplete="new-password"
          />
        </div>

        <button type="submit" disabled={isLoading} class="w-full btn-primary">
          {isLoading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <!-- Login Link -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Already have an account?
          <a
            href={config.routes.login}
            class="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>

    <!-- Footer -->
    <p class="text-center text-xs text-gray-500 dark:text-gray-400 mt-8">
      &copy; {new Date().getFullYear()} {config.companyName}. All rights reserved.
    </p>
  </div>
</div>
