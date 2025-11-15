<script lang="ts">
  import { ArrowRight, Zap, Shield, Palette } from 'lucide-svelte'
  import Card from '$lib/components/Card.svelte'
  import config from '$lib/config'

  /**
   * Home Page
   *
   * Landing page for authenticated users.
   * TODO: Customize this page with your own content.
   */

  const features = [
    {
      icon: Zap,
      title: 'Fast & Modern',
      description: 'Built with SvelteKit, TypeScript, and Vite for lightning-fast performance.',
    },
    {
      icon: Shield,
      title: 'Secure Authentication',
      description: 'JWT-based authentication with protected routes and role-based access control.',
    },
    {
      icon: Palette,
      title: 'Dark Mode',
      description: 'Beautiful dark mode support with Tailwind CSS and persistent preferences.',
    },
  ]

  const techStack = ['SvelteKit', 'TypeScript', 'Vite', 'Tailwind CSS', 'Lucide Icons']
</script>

<div class="page-container">
  <div class="page-content">
    <!-- Hero Section -->
    <div class="text-center py-12 md:py-20">
      <h1 class="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
        Welcome to <span class="text-blue-600 dark:text-blue-400">{config.appName}</span>
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
        {config.appDescription}
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a href={config.routes.dashboard} class="btn-primary inline-flex items-center justify-center">
          Get Started
          <ArrowRight class="w-4 h-4 ml-2" />
        </a>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          class="btn-secondary inline-flex items-center justify-center"
        >
          View on GitHub
        </a>
      </div>
    </div>

    <!-- Features Grid -->
    <div class="py-12">
      <h2 class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        {#each features as feature}
          <Card>
            <div class="flex flex-col items-center text-center">
              <div class="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg mb-4">
                <svelte:component this={feature.icon} class="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p class="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          </Card>
        {/each}
      </div>
    </div>

    <!-- Tech Stack -->
    <div class="py-12">
      <Card>
        <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Built With Modern Technologies
        </h2>
        <div class="flex flex-wrap justify-center gap-4">
          {#each techStack as tech}
            <span
              class="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {tech}
            </span>
          {/each}
        </div>
      </Card>
    </div>

    <!-- CTA Section -->
    <div class="py-12 text-center">
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Ready to Build Something Amazing?
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          This template provides everything you need to get started quickly.
        </p>
        <a href={config.routes.dashboard} class="btn-primary inline-flex items-center">
          Explore Dashboard
          <ArrowRight class="w-4 h-4 ml-2" />
        </a>
      </Card>
    </div>
  </div>
</div>
