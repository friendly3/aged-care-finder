<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';

	let { children, data } = $props();

	let isNavOpen = $state(true);
	let showUserMenu = $state(false);

	const currentPath = $derived(page.url.pathname);

	// Client-side auth guard - use session for reliability (data.session comes from server load)
	$effect(() => {
		if (typeof window !== 'undefined' && !data.session && !window.location.pathname.startsWith('/auth')) {
			goto('/auth', { replaceState: true });
		}
	});

	async function handleLogout() {
		try {
			const response = await fetch('/auth/logout', { method: 'POST', body: new FormData() })
			if (response.ok) {
				window.location.href = '/auth'
			} else {
				console.error('Logout failed')
				window.location.href = '/auth'
			}
		} catch (err) {
			console.error('Logout error:', err)
			window.location.href = '/auth'
		}
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex h-screen overflow-hidden bg-warm-50">
	{#if data.user}
	<!-- Collapsible Left Navigation -->
	<div class="flex flex-col border-r border-warm-200 bg-white transition-all duration-300 {isNavOpen ? 'w-64' : 'w-16'}">
		<!-- Header with Hamburger -->
		<div class="flex items-center justify-between border-b border-warm-200 px-4 py-4">
			{#if isNavOpen}
				<div class="font-semibold text-warm-800">Menu</div>
			{/if}
			<button onclick={() => (isNavOpen = !isNavOpen)}
				class="rounded-lg p-2 text-warm-500 hover:bg-warm-100 hover:text-warm-700"
				aria-label="Toggle navigation"
				title="Toggle navigation">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
				</svg>
			</button>
		</div>

		<!-- Nav Content -->
		<div class="flex-1 overflow-auto p-3 text-sm">
			{#if isNavOpen}
				<nav class="space-y-1 text-warm-600">
					<a
						href="/dashboard"
						class="flex items-center gap-3 rounded-lg px-3 py-2 transition {currentPath === '/dashboard'
							? 'bg-accent-100 text-accent-700 font-medium'
							: 'hover:bg-warm-100'}"
					>
						<span class="text-lg">📊</span>
						<span>Dashboard</span>
					</a>
					<a
						href="/"
						class="flex items-center gap-3 rounded-lg px-3 py-2 transition {currentPath === '/'
							? 'bg-accent-100 text-accent-700 font-medium'
							: 'hover:bg-warm-100'}"
					>
						<span class="text-lg">📋</span>
						<span>Incidents</span>
					</a>
					<a
						href="/team"
						class="flex items-center gap-3 rounded-lg px-3 py-2 transition {currentPath === '/team'
							? 'bg-accent-100 text-accent-700 font-medium'
							: 'hover:bg-warm-100'}"
					>
						<span class="text-lg">👥</span>
						<span>Team</span>
					</a>
				</nav>
			{:else}
				<div class="flex flex-col items-center gap-6 pt-6 text-2xl text-warm-400">
					<a href="/dashboard" title="Dashboard" class="hover:text-warm-600 transition">📊</a>
					<a href="/" title="Incidents" class="hover:text-warm-600 transition">📋</a>
					<a href="/team" title="Team Management" class="hover:text-warm-600 transition">👥</a>
				</div>
			{/if}
		</div>

		<!-- User Profile & Logout -->
		{#if data.session?.user}
			<div class="border-t border-warm-200 p-3 space-y-2">
				{#if isNavOpen}
					<div class="px-3 py-2 text-xs text-warm-500 truncate" title={data.session.user.email}>
						{data.session.user.email}
					</div>
					<button
						onclick={handleLogout}
						class="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-warm-600 hover:bg-warm-100 transition text-sm"
					>
						<span>🚪</span>
						<span>Logout</span>
					</button>
				{:else}
					<button
						onclick={handleLogout}
						title="Logout"
						class="w-full flex justify-center text-warm-400 hover:text-warm-600 transition text-lg"
					>
						🚪
					</button>
				{/if}
			</div>
		{/if}
	</div>
	{/if}

	<!-- Main Content Area -->
	<div class="flex-1 flex flex-col overflow-hidden">
		{@render children()}
	</div>
</div>
