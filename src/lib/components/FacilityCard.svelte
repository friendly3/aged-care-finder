<script lang="ts">
	import type { Facility } from '$lib/data/facilities';
	import StarRating from './StarRating.svelte';

	interface Props {
		facility: Facility;
		compareSelected: boolean;
		onToggleCompare: (id: string) => void;
	}

	let { facility, compareSelected, onToggleCompare }: Props = $props();
</script>

<a
	href="/facility/{facility.id}"
	class="block rounded-lg border border-gray-800 bg-gray-900 p-5 transition hover:border-gray-600"
>
	<div class="flex items-start justify-between gap-3">
		<div class="min-w-0 flex-1">
			<h3 class="truncate text-lg font-semibold text-white">{facility.name}</h3>
			<p class="text-sm text-gray-400">{facility.provider}</p>
		</div>
		<button
			onclick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleCompare(facility.id); }}
			class="shrink-0 rounded px-2 py-1 text-xs font-medium transition {compareSelected
				? 'bg-blue-600 text-white'
				: 'border border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200'}"
			aria-label="{compareSelected ? 'Remove from' : 'Add to'} comparison"
		>
			{compareSelected ? 'Comparing' : 'Compare'}
		</button>
	</div>

	<div class="mt-2 flex items-center gap-3">
		<StarRating rating={facility.starRating} size="sm" />
		<span
			class="rounded-full px-2 py-0.5 text-xs font-medium {facility.complianceStatus === 'Met'
				? 'bg-green-900/50 text-green-400'
				: facility.complianceStatus === 'Not Met'
					? 'bg-red-900/50 text-red-400'
					: 'bg-yellow-900/50 text-yellow-400'}"
		>
			{facility.complianceStatus}
		</span>
	</div>

	<p class="mt-2 text-sm text-gray-400">
		{facility.suburb}, {facility.state} {facility.postcode}
	</p>

	<div class="mt-3 flex flex-wrap gap-1.5">
		{#each facility.services.slice(0, 4) as service}
			<span class="rounded bg-gray-800 px-2 py-0.5 text-xs text-gray-300">{service}</span>
		{/each}
		{#if facility.services.length > 4}
			<span class="rounded bg-gray-800 px-2 py-0.5 text-xs text-gray-500">+{facility.services.length - 4} more</span>
		{/if}
	</div>

	<div class="mt-3 flex items-center justify-between text-sm">
		<span class="text-gray-400">
			{facility.totalBeds} beds
			<span class="text-gray-600">|</span>
			{#if facility.availableBeds > 0}
				<span class="text-green-400">{facility.availableBeds} available</span>
			{:else}
				<span class="text-red-400">No vacancies</span>
			{/if}
		</span>
		<span class="text-white font-medium">${facility.dailyPrice.from}–${facility.dailyPrice.to}/day</span>
	</div>
</a>
