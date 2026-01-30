<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { auth, isAuthenticated } from '$lib/stores/auth';
	import Navigation from '$lib/components/Navigation.svelte';
	import '../app.css';

	/**
	 * Root Layout - Wrapper for all pages
	 *
	 * Handles:
	 * - Auth initialization on app startup
	 * - Route protection (redirect unauthenticated users)
	 * - Conditional navigation display
	 */

	// Public pages that don't require authentication
	const publicPages = ['/', '/auth/callback'];

	// Initialize auth on mount
	onMount(async () => {
		await auth.initialize();
	});

	// Check if current path is public
	$: isPublicPath = publicPages.some((path) => $page.url.pathname.startsWith(path));

	// Redirect to login if not authenticated and trying to access protected page
	$: if (browser && !$isAuthenticated && !isPublicPath) {
		goto('/');
	}

	// Show navigation when authenticated and not on public pages
	$: showNav = $isAuthenticated && !isPublicPath;
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
	{#if showNav}
		<Navigation />
	{/if}
	<slot />
</div>
