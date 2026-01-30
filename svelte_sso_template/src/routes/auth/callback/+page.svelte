<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { auth } from '$lib/stores/auth';

	let error: string | null = null;

	onMount(async () => {
		const code = $page.url.searchParams.get('code');
		const state = $page.url.searchParams.get('state');
		const errorParam = $page.url.searchParams.get('error');
		const errorDescription = $page.url.searchParams.get('error_description');

		if (errorParam) {
			error = errorDescription || errorParam;
			return;
		}

		if (!code) {
			error = 'No authorization code received';
			return;
		}

		const success = await auth.handleCallback(code, state || undefined);

		if (success) {
			goto('/dashboard');
		} else {
			error = 'Authentication failed. Please try again.';
		}
	});
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
	<div class="max-w-md w-full text-center">
		{#if error}
			<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
				<div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
					<svg class="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</div>
				<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
					Authentication Error
				</h2>
				<p class="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
				<a
					href="/"
					class="inline-flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
				>
					Try Again
				</a>
			</div>
		{:else}
			<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
				<div class="w-16 h-16 mx-auto mb-4">
					<svg class="animate-spin text-primary-600" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
					</svg>
				</div>
				<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
					Signing you in...
				</h2>
				<p class="text-gray-600 dark:text-gray-400">
					Please wait while we complete your authentication.
				</p>
			</div>
		{/if}
	</div>
</div>
