<script lang="ts">
  import { User, Mail, Calendar, Shield } from 'lucide-svelte'
  import Card from '$lib/components/Card.svelte'
  import { user } from '$lib/stores/auth'
  import { theme } from '$lib/stores/theme'
  import config from '$lib/config'

  /**
   * Profile Page
   *
   * Displays user profile information and preferences.
   * TODO: Add functionality to edit profile, change password, etc.
   */
</script>

{#if $user}
  <div class="page-container">
    <div class="page-content max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <!-- Profile Information -->
      <Card title="Profile Information" className="mb-6">
        <div class="flex items-center space-x-6 mb-6">
          <div
            class="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold"
          >
            {$user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">{$user.name}</h3>
            <p class="text-gray-600 dark:text-gray-400">{$user.email}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <User class="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400">Name</p>
              <p class="text-sm font-medium text-gray-900 dark:text-white">{$user.name}</p>
            </div>
          </div>

          <div class="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <Mail class="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400">Email</p>
              <p class="text-sm font-medium text-gray-900 dark:text-white">{$user.email}</p>
            </div>
          </div>

          <div class="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <Shield class="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400">Role</p>
              <p class="text-sm font-medium text-gray-900 dark:text-white capitalize">{$user.role}</p>
            </div>
          </div>

          <div class="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <Calendar class="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400">Member Since</p>
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                {new Date($user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <!-- TODO: Add edit profile functionality -->
        <div class="mt-6 flex space-x-3">
          <button class="btn-primary" disabled> Edit Profile </button>
          <button class="btn-secondary" disabled> Change Password </button>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
          TODO: Implement profile editing functionality
        </p>
      </Card>

      <!-- Preferences -->
      <Card title="Preferences" description="Customize your experience">
        <div class="space-y-4">
          <!-- Theme Toggle -->
          {#if config.features.enableDarkMode}
            <div
              class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">Dark Mode</p>
                <p class="text-xs text-gray-600 dark:text-gray-400">
                  Toggle between light and dark theme
                </p>
              </div>
              <button
                on:click={() => theme.toggleTheme()}
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors {$theme ===
                'dark'
                  ? 'bg-blue-600'
                  : 'bg-gray-300'}"
              >
                <span
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform {$theme ===
                  'dark'
                    ? 'translate-x-6'
                    : 'translate-x-1'}"
                />
              </button>
            </div>
          {/if}

          <!-- More preference options - TODO: Add more preferences -->
          <div
            class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg opacity-50"
          >
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">Email Notifications</p>
              <p class="text-xs text-gray-600 dark:text-gray-400">Receive email updates</p>
            </div>
            <button
              class="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300"
              disabled
            >
              <span
                class="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1"
              />
            </button>
          </div>
        </div>
      </Card>

      <!-- Danger Zone -->
      <Card title="Danger Zone" className="border-red-200 dark:border-red-800">
        <div class="space-y-3">
          <button
            class="w-full px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors font-medium"
            disabled
          >
            Delete Account
          </button>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            TODO: Implement account deletion with confirmation
          </p>
        </div>
      </Card>
    </div>
  </div>
{/if}
