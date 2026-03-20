<script lang="ts">
	import { page } from '$app/state';
	import { facilityStore } from '$lib/data/store.svelte';
	import StarRating from '$lib/components/StarRating.svelte';

	const facility = $derived(facilityStore.list.find((f) => f.id === page.params.id));
</script>

<svelte:head>
	<title>{facility ? facility.name : 'Not Found'} | Aged Care Finder</title>
</svelte:head>

<div class="min-h-screen bg-warm-50 text-warm-900">
	{#if facility}
		<header class="border-b border-warm-200 bg-white/80 px-6 py-4 backdrop-blur">
			<div class="mx-auto max-w-5xl">
				<a href="/" class="text-sm text-accent-600 hover:text-accent-700">&larr; Back to search</a>
			</div>
		</header>

		<main class="mx-auto max-w-5xl px-6 py-8">
			<div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<h1 class="text-3xl font-bold text-warm-800">{facility.name}</h1>
					<p class="mt-1 text-warm-500">{facility.provider}</p>
					<p class="mt-1 text-sm text-warm-400">
						{facility.address}, {facility.suburb}, {facility.state} {facility.postcode}
					</p>
					<p class="mt-1 text-sm text-warm-400">{facility.phone}</p>
				</div>
				<div class="flex flex-col items-end gap-2">
					<StarRating rating={facility.starRating} size="lg" />
					<span
						class="rounded-full px-3 py-1 text-sm font-medium {facility.complianceStatus === 'Met'
							? 'bg-green-100 text-green-700'
							: facility.complianceStatus === 'Not Met'
								? 'bg-red-100 text-red-700'
								: 'bg-yellow-100 text-yellow-700'}"
					>
						Compliance: {facility.complianceStatus}
					</span>
				</div>
			</div>

			<p class="mt-6 text-warm-600">{facility.description}</p>

			<div class="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
				<div class="rounded-lg border border-warm-200 bg-white p-5 shadow-sm">
					<h2 class="text-lg font-semibold text-warm-800">Pricing</h2>
					<div class="mt-4 space-y-3">
						<div class="flex justify-between">
							<span class="text-warm-500">Daily accommodation</span>
							<span class="text-warm-800">${facility.dailyPrice.from} – ${facility.dailyPrice.to}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-warm-500">Refundable deposit</span>
							<span class="text-warm-800">
								${facility.refundableDeposit.from.toLocaleString()} – ${facility.refundableDeposit.to.toLocaleString()}
							</span>
						</div>
					</div>
				</div>

				<div class="rounded-lg border border-warm-200 bg-white p-5 shadow-sm">
					<h2 class="text-lg font-semibold text-warm-800">Capacity</h2>
					<div class="mt-4 space-y-3">
						<div class="flex justify-between">
							<span class="text-warm-500">Total beds</span>
							<span class="text-warm-800">{facility.totalBeds}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-warm-500">Available beds</span>
							<span class={facility.availableBeds > 0 ? 'text-green-600' : 'text-red-600'}>
								{facility.availableBeds > 0 ? facility.availableBeds : 'No vacancies'}
							</span>
						</div>
						<div class="flex justify-between">
							<span class="text-warm-500">Type</span>
							<span class="text-warm-800">{facility.type}</span>
						</div>
					</div>
				</div>

				<div class="rounded-lg border border-warm-200 bg-white p-5 shadow-sm">
					<h2 class="text-lg font-semibold text-warm-800">Quality Measures</h2>
					<div class="mt-4 space-y-3">
						{#each Object.entries(facility.qualityMeasures) as [key, value]}
							<div class="flex items-center justify-between">
								<span class="text-warm-500 capitalize">{key}</span>
								<div class="flex items-center gap-2">
									<div class="h-2 w-24 overflow-hidden rounded-full bg-warm-200">
										<div
											class="h-full rounded-full {value >= 4 ? 'bg-green-500' : value >= 3 ? 'bg-yellow-500' : 'bg-red-500'}"
											style="width: {(value / 5) * 100}%"
										></div>
									</div>
									<span class="w-6 text-right text-sm text-warm-600">{value}/5</span>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<div class="rounded-lg border border-warm-200 bg-white p-5 shadow-sm">
					<h2 class="text-lg font-semibold text-warm-800">Audit Information</h2>
					<div class="mt-4 space-y-3">
						<div class="flex justify-between">
							<span class="text-warm-500">Last audit date</span>
							<span class="text-warm-800">
								{new Date(facility.lastAuditDate).toLocaleDateString('en-AU', {
									day: 'numeric',
									month: 'long',
									year: 'numeric'
								})}
							</span>
						</div>
						<div class="flex justify-between">
							<span class="text-warm-500">Compliance status</span>
							<span
								class={facility.complianceStatus === 'Met'
									? 'text-green-600'
									: facility.complianceStatus === 'Not Met'
										? 'text-red-600'
										: 'text-yellow-600'}
							>
								{facility.complianceStatus}
							</span>
						</div>
					</div>
				</div>
			</div>

			<div class="mt-6 rounded-lg border border-warm-200 bg-white p-5 shadow-sm">
				<h2 class="text-lg font-semibold text-warm-800">Services</h2>
				<div class="mt-4 flex flex-wrap gap-2">
					{#each facility.services as service}
						<span class="rounded-full bg-warm-100 px-3 py-1 text-sm text-warm-600">{service}</span>
					{/each}
				</div>
			</div>
		</main>
	{:else}
		<main class="mx-auto max-w-5xl px-6 py-12 text-center">
			<h1 class="text-2xl font-bold text-warm-800">Facility not found</h1>
			<a href="/" class="mt-4 inline-block text-accent-600 hover:text-accent-700">Back to search</a>
		</main>
	{/if}
</div>
