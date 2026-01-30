<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth, isAuthenticated, isLoading, authError } from '$lib/stores/auth';
	import config from '$lib/config';

	// Auto-redirect to dashboard if already authenticated
	$: if ($isAuthenticated) {
		goto(config.routes.dashboard);
	}

	function handleLogin() {
		auth.login();
	}
</script>

<svelte:head>
	<title>{config.appName} - Sign In</title>
</svelte:head>

<div
	class="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center p-4"
>
	<div class="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
		<!-- App Header -->
		<div class="text-center mb-8">
			<div class="flex justify-center mb-4">
				<img src={config.logoPath} alt={config.appName} class="h-16 w-16" />
			</div>
			<h1 class="text-3xl font-bold text-gray-900 dark:text-white">
				{config.appName}
			</h1>
			<p class="mt-2 text-gray-600 dark:text-gray-400">
				{config.appDescription}
			</p>
		</div>

		<!-- Error Message -->
		{#if $authError}
			<div
				class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
			>
				<p class="text-sm text-red-600 dark:text-red-400">{$authError}</p>
			</div>
		{/if}

		<!-- Sign In Button -->
		<button
			on:click={handleLogin}
			disabled={$isLoading}
			class="w-full flex items-center justify-center px-6 py-3 bg-gray-900 dark:bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
		>
			{#if $isLoading}
				<svg
					class="animate-spin h-5 w-5 mr-2"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle
						class="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						stroke-width="4"
					/>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
					/>
				</svg>
				Redirecting...
			{:else}
				<svg class="w-5 h-5 mr-2" viewBox="0 0 21 21" fill="currentColor">
					<path
						d="M0 0h10v10H0V0zm11 0h10v10H11V0zM0 11h10v10H0V11zm11 0h10v10H11V11z"
					/>
				</svg>
				Sign in with Microsoft
			{/if}
		</button>

		<!-- Help Text -->
		<p class="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
			Use your organization's Microsoft account to sign in
		</p>

		<!-- Divider -->
		<div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
			<div class="text-center text-xs text-gray-500 dark:text-gray-400">
				<p>Secured with Microsoft EntraID</p>
				<p class="mt-1">
					Don't have access?
					<a
						href="mailto:admin@example.com"
						class="text-blue-600 dark:text-blue-400 hover:underline"
					>
						Contact your administrator
					</a>
				</p>
			</div>
		</div>
	</div>
</div>

<style>
	/* Add any custom styles here */
</style>
