<script lang="ts">
	import { page } from '$app/state';
	import { facilityStore } from '$lib/data/store.svelte';
	import StarRating from '$lib/components/StarRating.svelte';

	const facility = $derived(facilityStore.list.find((f) => f.id === page.params.id));
</script>

<svelte:head>
	<title>{facility ? facility.name : 'Not Found'} | Aged Care Finder</title>
</svelte:head>

<div class="min-h-screen bg-gray-950 text-gray-100">
	{#if facility}
		<!-- Back nav -->
		<header class="border-b border-gray-800 px-6 py-4">
			<div class="mx-auto max-w-5xl">
				<a href="/" class="text-sm text-blue-400 hover:text-blue-300">&larr; Back to search</a>
			</div>
		</header>

		<main class="mx-auto max-w-5xl px-6 py-8">
			<!-- Title section -->
			<div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<h1 class="text-3xl font-bold text-white">{facility.name}</h1>
					<p class="mt-1 text-gray-400">{facility.provider}</p>
					<p class="mt-1 text-sm text-gray-500">
						{facility.address}, {facility.suburb}, {facility.state} {facility.postcode}
					</p>
					<p class="mt-1 text-sm text-gray-500">{facility.phone}</p>
				</div>
				<div class="flex flex-col items-end gap-2">
					<StarRating rating={facility.starRating} size="lg" />
					<span
						class="rounded-full px-3 py-1 text-sm font-medium {facility.complianceStatus === 'Met'
							? 'bg-green-900/50 text-green-400'
							: facility.complianceStatus === 'Not Met'
								? 'bg-red-900/50 text-red-400'
								: 'bg-yellow-900/50 text-yellow-400'}"
					>
						Compliance: {facility.complianceStatus}
					</span>
				</div>
			</div>

			<p class="mt-6 text-gray-300">{facility.description}</p>

			<!-- Info grid -->
			<div class="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
				<!-- Pricing -->
				<div class="rounded-lg border border-gray-800 bg-gray-900 p-5">
					<h2 class="text-lg font-semibold text-white">Pricing</h2>
					<div class="mt-4 space-y-3">
						<div class="flex justify-between">
							<span class="text-gray-400">Daily accommodation</span>
							<span class="text-white">${facility.dailyPrice.from} – ${facility.dailyPrice.to}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-400">Refundable deposit</span>
							<span class="text-white">
								${facility.refundableDeposit.from.toLocaleString()} – ${facility.refundableDeposit.to.toLocaleString()}
							</span>
						</div>
					</div>
				</div>

				<!-- Capacity -->
				<div class="rounded-lg border border-gray-800 bg-gray-900 p-5">
					<h2 class="text-lg font-semibold text-white">Capacity</h2>
					<div class="mt-4 space-y-3">
						<div class="flex justify-between">
							<span class="text-gray-400">Total beds</span>
							<span class="text-white">{facility.totalBeds}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-400">Available beds</span>
							<span class={facility.availableBeds > 0 ? 'text-green-400' : 'text-red-400'}>
								{facility.availableBeds > 0 ? facility.availableBeds : 'No vacancies'}
							</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-400">Type</span>
							<span class="text-white">{facility.type}</span>
						</div>
					</div>
				</div>

				<!-- Quality measures -->
				<div class="rounded-lg border border-gray-800 bg-gray-900 p-5">
					<h2 class="text-lg font-semibold text-white">Quality Measures</h2>
					<div class="mt-4 space-y-3">
						{#each Object.entries(facility.qualityMeasures) as [key, value]}
							<div class="flex items-center justify-between">
								<span class="text-gray-400 capitalize">{key}</span>
								<div class="flex items-center gap-2">
									<div class="h-2 w-24 overflow-hidden rounded-full bg-gray-700">
										<div
											class="h-full rounded-full {value >= 4 ? 'bg-green-500' : value >= 3 ? 'bg-yellow-500' : 'bg-red-500'}"
											style="width: {(value / 5) * 100}%"
										></div>
									</div>
									<span class="w-6 text-right text-sm text-gray-300">{value}/5</span>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<!-- Audit -->
				<div class="rounded-lg border border-gray-800 bg-gray-900 p-5">
					<h2 class="text-lg font-semibold text-white">Audit Information</h2>
					<div class="mt-4 space-y-3">
						<div class="flex justify-between">
							<span class="text-gray-400">Last audit date</span>
							<span class="text-white">
								{new Date(facility.lastAuditDate).toLocaleDateString('en-AU', {
									day: 'numeric',
									month: 'long',
									year: 'numeric'
								})}
							</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-400">Compliance status</span>
							<span
								class={facility.complianceStatus === 'Met'
									? 'text-green-400'
									: facility.complianceStatus === 'Not Met'
										? 'text-red-400'
										: 'text-yellow-400'}
							>
								{facility.complianceStatus}
							</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Services -->
			<div class="mt-6 rounded-lg border border-gray-800 bg-gray-900 p-5">
				<h2 class="text-lg font-semibold text-white">Services</h2>
				<div class="mt-4 flex flex-wrap gap-2">
					{#each facility.services as service}
						<span class="rounded-full bg-gray-800 px-3 py-1 text-sm text-gray-300">{service}</span>
					{/each}
				</div>
			</div>
		</main>
	{:else}
		<main class="mx-auto max-w-5xl px-6 py-12 text-center">
			<h1 class="text-2xl font-bold text-white">Facility not found</h1>
			<a href="/" class="mt-4 inline-block text-blue-400 hover:text-blue-300">Back to search</a>
		</main>
	{/if}
</div>
