<script lang="ts">
  import clsx from 'clsx'

  /**
   * Card - Reusable card component
   *
   * A simple card component with optional title and description.
   * TODO: Customize styling to match your design system.
   */

  export let className: string = ''
  export let title: string | undefined = undefined
  export let description: string | undefined = undefined
</script>

<div class={clsx('card', className)}>
  {#if title || description}
    <div class="mb-4">
      {#if title}
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
      {/if}
      {#if description}
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
      {/if}
    </div>
  {/if}
  <slot />
</div>
