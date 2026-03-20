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

<div class="min-h-screen bg-warm-50 text-warm-900">
	<header class="border-b border-warm-200 bg-white/80 px-6 py-4 backdrop-blur">
		<div class="mx-auto max-w-7xl">
			<a href="/" class="text-sm text-accent-600 hover:text-accent-700">&larr; Back to search</a>
			<h1 class="mt-2 text-2xl font-bold text-warm-800">Compare Facilities</h1>
		</div>
	</header>

	<main class="mx-auto max-w-7xl px-6 py-8">
		{#if selected.length < 2}
			<div class="text-center">
				<p class="text-lg text-warm-400">Select at least 2 facilities to compare.</p>
				<a href="/" class="mt-3 inline-block text-accent-600 hover:text-accent-700">Back to search</a>
			</div>
		{:else}
			<div class="overflow-x-auto rounded-lg border border-warm-200 bg-white shadow-sm">
				<table class="w-full text-left text-sm">
					<thead>
						<tr class="border-b border-warm-200">
							<th class="sticky left-0 bg-white py-3 pr-4 pl-4 font-medium text-warm-500 min-w-[140px]"></th>
							{#each selected as f}
								<th class="px-4 py-3 font-medium min-w-[200px]">
									<a href="/facility/{f.id}" class="text-base text-warm-800 hover:text-accent-600">
										{f.name}
									</a>
									<p class="mt-0.5 text-xs font-normal text-warm-400">{f.provider}</p>
								</th>
							{/each}
						</tr>
					</thead>
					<tbody>
						<tr class="border-b border-warm-100">
							<td class="sticky left-0 bg-white py-3 pr-4 pl-4 text-warm-500">Star Rating</td>
							{#each selected as f}
								<td class="px-4 py-3"><StarRating rating={f.starRating} size="sm" /></td>
							{/each}
						</tr>
						<tr class="border-b border-warm-100">
							<td class="sticky left-0 bg-white py-3 pr-4 pl-4 text-warm-500">Location</td>
							{#each selected as f}
								<td class="px-4 py-3 text-warm-800">{f.suburb}, {f.state}</td>
							{/each}
						</tr>
						<tr class="border-b border-warm-100">
							<td class="sticky left-0 bg-white py-3 pr-4 pl-4 text-warm-500">Type</td>
							{#each selected as f}
								<td class="px-4 py-3 text-warm-800">{f.type}</td>
							{/each}
						</tr>
						<tr class="border-b border-warm-100">
							<td class="sticky left-0 bg-white py-3 pr-4 pl-4 text-warm-500">Daily Price</td>
							{#each selected as f}
								<td class="px-4 py-3 text-warm-800">${f.dailyPrice.from} – ${f.dailyPrice.to}</td>
							{/each}
						</tr>
						<tr class="border-b border-warm-100">
							<td class="sticky left-0 bg-white py-3 pr-4 pl-4 text-warm-500">Refundable Deposit</td>
							{#each selected as f}
								<td class="px-4 py-3 text-warm-800">
									${f.refundableDeposit.from.toLocaleString()} – ${f.refundableDeposit.to.toLocaleString()}
								</td>
							{/each}
						</tr>
						<tr class="border-b border-warm-100">
							<td class="sticky left-0 bg-white py-3 pr-4 pl-4 text-warm-500">Total Beds</td>
							{#each selected as f}
								<td class="px-4 py-3 text-warm-800">{f.totalBeds}</td>
							{/each}
						</tr>
						<tr class="border-b border-warm-100">
							<td class="sticky left-0 bg-white py-3 pr-4 pl-4 text-warm-500">Available Beds</td>
							{#each selected as f}
								<td class="px-4 py-3 {f.availableBeds > 0 ? 'text-green-600' : 'text-red-600'}">
									{f.availableBeds > 0 ? f.availableBeds : 'None'}
								</td>
							{/each}
						</tr>
						<tr class="border-b border-warm-100">
							<td class="sticky left-0 bg-white py-3 pr-4 pl-4 text-warm-500">Compliance</td>
							{#each selected as f}
								<td class="px-4 py-3">
									<span class={f.complianceStatus === 'Met' ? 'text-green-600' : f.complianceStatus === 'Not Met' ? 'text-red-600' : 'text-yellow-600'}>
										{f.complianceStatus}
									</span>
								</td>
							{/each}
						</tr>
						<tr class="border-b border-warm-100">
							<td class="sticky left-0 bg-white py-3 pr-4 pl-4 text-warm-500">Resident Experience</td>
							{#each selected as f}
								<td class="px-4 py-3 text-warm-800">{f.qualityMeasures.residents}/5</td>
							{/each}
						</tr>
						<tr class="border-b border-warm-100">
							<td class="sticky left-0 bg-white py-3 pr-4 pl-4 text-warm-500">Staffing</td>
							{#each selected as f}
								<td class="px-4 py-3 text-warm-800">{f.qualityMeasures.staffing}/5</td>
							{/each}
						</tr>
						<tr class="border-b border-warm-100">
							<td class="sticky left-0 bg-white py-3 pr-4 pl-4 text-warm-500">Compliance Rating</td>
							{#each selected as f}
								<td class="px-4 py-3 text-warm-800">{f.qualityMeasures.compliance}/5</td>
							{/each}
						</tr>
						<tr class="border-b border-warm-100">
							<td class="sticky left-0 bg-white py-3 pr-4 pl-4 text-warm-500">Quality Rating</td>
							{#each selected as f}
								<td class="px-4 py-3 text-warm-800">{f.qualityMeasures.quality}/5</td>
							{/each}
						</tr>
						<tr>
							<td class="sticky left-0 bg-white py-3 pr-4 pl-4 align-top text-warm-500">Services</td>
							{#each selected as f}
								<td class="px-4 py-3">
									<div class="flex flex-wrap gap-1">
										{#each f.services as service}
											<span class="rounded bg-warm-100 px-2 py-0.5 text-xs text-warm-600">{service}</span>
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
