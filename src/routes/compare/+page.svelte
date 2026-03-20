<script lang="ts">
	import { page } from '$app/state';
	import { facilityStore } from '$lib/data/store.svelte';
	import StarRating from '$lib/components/StarRating.svelte';

	const ids = $derived((page.url.searchParams.get('ids') ?? '').split(',').filter(Boolean));
	const selected = $derived(ids.map((id) => facilityStore.list.find((f) => f.id === id)).filter(Boolean));
</script>

<svelte:head>
	<title>Compare Facilities | Aged Care Finder</title>
</svelte:head>

<div class="min-h-screen bg-gray-950 text-gray-100">
	<header class="border-b border-gray-800 px-6 py-4">
		<div class="mx-auto max-w-7xl">
			<a href="/" class="text-sm text-blue-400 hover:text-blue-300">&larr; Back to search</a>
			<h1 class="mt-2 text-2xl font-bold text-white">Compare Facilities</h1>
		</div>
	</header>

	<main class="mx-auto max-w-7xl px-6 py-8">
		{#if selected.length < 2}
			<div class="text-center">
				<p class="text-lg text-gray-500">Select at least 2 facilities to compare.</p>
				<a href="/" class="mt-3 inline-block text-blue-400 hover:text-blue-300">Back to search</a>
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full text-left text-sm">
					<thead>
						<tr class="border-b border-gray-800">
							<th class="sticky left-0 bg-gray-950 py-3 pr-4 font-medium text-gray-400 min-w-[140px]"></th>
							{#each selected as f}
								<th class="px-4 py-3 font-medium min-w-[200px]">
									<a href="/facility/{f.id}" class="text-base text-white hover:text-blue-400">
										{f.name}
									</a>
									<p class="mt-0.5 text-xs font-normal text-gray-500">{f.provider}</p>
								</th>
							{/each}
						</tr>
					</thead>
					<tbody>
						<!-- Star Rating -->
						<tr class="border-b border-gray-800/50">
							<td class="sticky left-0 bg-gray-950 py-3 pr-4 text-gray-400">Star Rating</td>
							{#each selected as f}
								<td class="px-4 py-3"><StarRating rating={f.starRating} size="sm" /></td>
							{/each}
						</tr>

						<!-- Location -->
						<tr class="border-b border-gray-800/50">
							<td class="sticky left-0 bg-gray-950 py-3 pr-4 text-gray-400">Location</td>
							{#each selected as f}
								<td class="px-4 py-3 text-white">{f.suburb}, {f.state}</td>
							{/each}
						</tr>

						<!-- Type -->
						<tr class="border-b border-gray-800/50">
							<td class="sticky left-0 bg-gray-950 py-3 pr-4 text-gray-400">Type</td>
							{#each selected as f}
								<td class="px-4 py-3 text-white">{f.type}</td>
							{/each}
						</tr>

						<!-- Daily Price -->
						<tr class="border-b border-gray-800/50">
							<td class="sticky left-0 bg-gray-950 py-3 pr-4 text-gray-400">Daily Price</td>
							{#each selected as f}
								<td class="px-4 py-3 text-white">${f.dailyPrice.from} – ${f.dailyPrice.to}</td>
							{/each}
						</tr>

						<!-- Refundable Deposit -->
						<tr class="border-b border-gray-800/50">
							<td class="sticky left-0 bg-gray-950 py-3 pr-4 text-gray-400">Refundable Deposit</td>
							{#each selected as f}
								<td class="px-4 py-3 text-white">
									${f.refundableDeposit.from.toLocaleString()} – ${f.refundableDeposit.to.toLocaleString()}
								</td>
							{/each}
						</tr>

						<!-- Beds -->
						<tr class="border-b border-gray-800/50">
							<td class="sticky left-0 bg-gray-950 py-3 pr-4 text-gray-400">Total Beds</td>
							{#each selected as f}
								<td class="px-4 py-3 text-white">{f.totalBeds}</td>
							{/each}
						</tr>

						<!-- Available -->
						<tr class="border-b border-gray-800/50">
							<td class="sticky left-0 bg-gray-950 py-3 pr-4 text-gray-400">Available Beds</td>
							{#each selected as f}
								<td class="px-4 py-3 {f.availableBeds > 0 ? 'text-green-400' : 'text-red-400'}">
									{f.availableBeds > 0 ? f.availableBeds : 'None'}
								</td>
							{/each}
						</tr>

						<!-- Compliance -->
						<tr class="border-b border-gray-800/50">
							<td class="sticky left-0 bg-gray-950 py-3 pr-4 text-gray-400">Compliance</td>
							{#each selected as f}
								<td class="px-4 py-3">
									<span
										class={f.complianceStatus === 'Met'
											? 'text-green-400'
											: f.complianceStatus === 'Not Met'
												? 'text-red-400'
												: 'text-yellow-400'}
									>
										{f.complianceStatus}
									</span>
								</td>
							{/each}
						</tr>

						<!-- Quality: Residents -->
						<tr class="border-b border-gray-800/50">
							<td class="sticky left-0 bg-gray-950 py-3 pr-4 text-gray-400">Resident Experience</td>
							{#each selected as f}
								<td class="px-4 py-3 text-white">{f.qualityMeasures.residents}/5</td>
							{/each}
						</tr>

						<!-- Quality: Staffing -->
						<tr class="border-b border-gray-800/50">
							<td class="sticky left-0 bg-gray-950 py-3 pr-4 text-gray-400">Staffing</td>
							{#each selected as f}
								<td class="px-4 py-3 text-white">{f.qualityMeasures.staffing}/5</td>
							{/each}
						</tr>

						<!-- Quality: Compliance -->
						<tr class="border-b border-gray-800/50">
							<td class="sticky left-0 bg-gray-950 py-3 pr-4 text-gray-400">Compliance Rating</td>
							{#each selected as f}
								<td class="px-4 py-3 text-white">{f.qualityMeasures.compliance}/5</td>
							{/each}
						</tr>

						<!-- Quality: Quality -->
						<tr class="border-b border-gray-800/50">
							<td class="sticky left-0 bg-gray-950 py-3 pr-4 text-gray-400">Quality Rating</td>
							{#each selected as f}
								<td class="px-4 py-3 text-white">{f.qualityMeasures.quality}/5</td>
							{/each}
						</tr>

						<!-- Services -->
						<tr>
							<td class="sticky left-0 bg-gray-950 py-3 pr-4 align-top text-gray-400">Services</td>
							{#each selected as f}
								<td class="px-4 py-3">
									<div class="flex flex-wrap gap-1">
										{#each f.services as service}
											<span class="rounded bg-gray-800 px-2 py-0.5 text-xs text-gray-300">{service}</span>
										{/each}
									</div>
								</td>
							{/each}
						</tr>
					</tbody>
				</table>
			</div>
		{/if}
	</main>
</div>
