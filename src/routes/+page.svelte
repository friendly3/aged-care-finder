<script lang="ts">
	import { facilityStore } from '$lib/data/store.svelte';
	import type { Facility } from '$lib/data/facilityStore.list';
	import SearchFilters from '$lib/components/SearchFilters.svelte';
	import FacilityCard from '$lib/components/FacilityCard.svelte';
	import CompareBar from '$lib/components/CompareBar.svelte';

	let filters = $state({
		search: '',
		selectedState: '',
		type: '',
		minRating: 0,
		services: [] as string[],
		sortBy: 'rating'
	});

	let compareIds = $state<string[]>([]);

	const filtered = $derived.by(() => {
		let result = facilityStore.list.filter((f) => {
			const q = filters.search.toLowerCase();
			if (q && !f.name.toLowerCase().includes(q) && !f.suburb.toLowerCase().includes(q) && !f.provider.toLowerCase().includes(q)) return false;
			if (filters.selectedState && f.state !== filters.selectedState) return false;
			if (filters.type && f.type !== filters.type) return false;
			if (filters.minRating && f.starRating < filters.minRating) return false;
			if (filters.services.length > 0 && !filters.services.every((s) => f.services.includes(s))) return false;
			return true;
		});

		result.sort((a, b) => {
			switch (filters.sortBy) {
				case 'rating': return b.starRating - a.starRating;
				case 'price-low': return a.dailyPrice.from - b.dailyPrice.from;
				case 'price-high': return b.dailyPrice.to - a.dailyPrice.to;
				case 'beds': return b.availableBeds - a.availableBeds;
				case 'name': return a.name.localeCompare(b.name);
				default: return 0;
			}
		});

		return result;
	});

	const compareList = $derived(
		compareIds.map((id) => facilityStore.list.find((f) => f.id === id)!).filter(Boolean)
	);

	function toggleCompare(id: string) {
		if (compareIds.includes(id)) {
			compareIds = compareIds.filter((i) => i !== id);
		} else if (compareIds.length < 4) {
			compareIds = [...compareIds, id];
		}
	}
</script>

<svelte:head>
	<title>Aged Care Finder | Search & Compare Facilities</title>
</svelte:head>

<div class="min-h-screen bg-gray-950 text-gray-100">
	<!-- Header -->
	<header class="border-b border-gray-800 bg-gray-950/80 px-6 py-5 backdrop-blur">
		<div class="mx-auto max-w-7xl">
			<h1 class="text-2xl font-bold text-white">Aged Care Finder by Yui</h1>
			<p class="mt-1 text-sm text-gray-400">
				Search and compare {facilityStore.list.length} aged care facilityStore.list across Australia
			</p>
		</div>
	</header>

	<main class="mx-auto max-w-7xl px-6 py-6">
		<SearchFilters
			{...filters}
			onUpdate={(f) => (filters = f)}
		/>

		<div class="mt-4 flex items-center justify-between">
			<p class="text-sm text-gray-400">
				{filtered.length} {filtered.length === 1 ? 'facility' : 'facilityStore.list'} found
			</p>
		</div>

		<div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 {compareIds.length > 0 ? 'pb-20' : ''}">
			{#each filtered as facility (facility.id)}
				<FacilityCard
					{facility}
					compareSelected={compareIds.includes(facility.id)}
					onToggleCompare={toggleCompare}
				/>
			{/each}
		</div>

		{#if filtered.length === 0}
			<div class="mt-12 text-center">
				<p class="text-lg text-gray-500">No facilityStore.list match your filters.</p>
				<button
					onclick={() => (filters = { search: '', selectedState: '', type: '', minRating: 0, services: [], sortBy: 'rating' })}
					class="mt-3 text-blue-400 hover:text-blue-300"
				>
					Clear all filters
				</button>
			</div>
		{/if}
	</main>

	<CompareBar
		selected={compareList}
		onRemove={(id) => (compareIds = compareIds.filter((i) => i !== id))}
		onClear={() => (compareIds = [])}
	/>
</div>
