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
	class="block rounded-lg border border-warm-200 bg-white p-5 shadow-sm transition hover:border-warm-300 hover:shadow-md"
>
	<div class="flex items-start justify-between gap-3">
		<div class="min-w-0 flex-1">
			<h3 class="truncate text-lg font-semibold text-warm-800">{facility.name}</h3>
			<p class="text-sm text-warm-500">{facility.provider}</p>
		</div>
		<button
			onclick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleCompare(facility.id); }}
			class="shrink-0 rounded px-2 py-1 text-xs font-medium transition {compareSelected
				? 'bg-accent-600 text-white'
				: 'border border-warm-300 text-warm-500 hover:border-warm-400 hover:text-warm-700'}"
			aria-label="{compareSelected ? 'Remove from' : 'Add to'} comparison"
		>
			{compareSelected ? 'Comparing' : 'Compare'}
		</button>
	</div>

	<div class="mt-2 flex items-center gap-3">
		<StarRating rating={facility.starRating} size="sm" />
		<span
			class="rounded-full px-2 py-0.5 text-xs font-medium {facility.complianceStatus === 'Met'
				? 'bg-green-100 text-green-700'
				: facility.complianceStatus === 'Not Met'
					? 'bg-red-100 text-red-700'
					: 'bg-yellow-100 text-yellow-700'}"
		>
			{facility.complianceStatus}
		</span>
	</div>

	<p class="mt-2 text-sm text-warm-500">
		{facility.suburb}, {facility.state} {facility.postcode}
	</p>

	<div class="mt-3 flex flex-wrap gap-1.5">
		{#each facility.services.slice(0, 4) as service}
			<span class="rounded bg-warm-100 px-2 py-0.5 text-xs text-warm-600">{service}</span>
		{/each}
		{#if facility.services.length > 4}
			<span class="rounded bg-warm-100 px-2 py-0.5 text-xs text-warm-400">+{facility.services.length - 4} more</span>
		{/if}
	</div>

	<div class="mt-3 flex items-center justify-between text-sm">
		<span class="text-warm-500">
			{facility.totalBeds} beds
			<span class="text-warm-300">|</span>
			{#if facility.availableBeds > 0}
				<span class="text-green-600">{facility.availableBeds} available</span>
			{:else}
				<span class="text-red-600">No vacancies</span>
			{/if}
		</span>
		<span class="text-warm-800 font-medium">${facility.dailyPrice.from}–${facility.dailyPrice.to}/day</span>
	</div>
</a>
