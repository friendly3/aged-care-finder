<script lang="ts">
	import { facilityStore } from '$lib/data/store.svelte';
	import type { Facility } from '$lib/data/facilities';
	import FacilityForm from '$lib/components/FacilityForm.svelte';

	let mode = $state<'list' | 'add' | 'edit'>('list');
	let editingFacility = $state<Facility | undefined>(undefined);
	let searchQuery = $state('');
	let deleteConfirmId = $state<string | null>(null);

	const filtered = $derived(
		facilityStore.list.filter((f) => {
			if (!searchQuery) return true;
			const q = searchQuery.toLowerCase();
			return f.name.toLowerCase().includes(q) || f.suburb.toLowerCase().includes(q) || f.provider.toLowerCase().includes(q);
		})
	);

	function startEdit(facility: Facility) {
		editingFacility = facility;
		mode = 'edit';
	}

	function handleSubmit(facility: Facility) {
		if (mode === 'edit' && editingFacility) {
			facilityStore.update(editingFacility.id, facility);
		} else {
			facilityStore.add(facility);
		}
		mode = 'list';
		editingFacility = undefined;
	}

	function handleDelete(id: string) {
		facilityStore.delete(id);
		deleteConfirmId = null;
	}

	function handleCancel() {
		mode = 'list';
		editingFacility = undefined;
	}
</script>

<svelte:head>
	<title>Admin | Aged Care Finder</title>
</svelte:head>

<div class="min-h-screen bg-gray-950 text-gray-100">
	<header class="border-b border-gray-800 px-6 py-4">
		<div class="mx-auto flex max-w-6xl items-center justify-between">
			<div>
				<a href="/" class="text-sm text-blue-400 hover:text-blue-300">&larr; Back to site</a>
				<h1 class="mt-1 text-2xl font-bold text-white">Manage Facilities</h1>
			</div>
			{#if mode === 'list'}
				<div class="flex gap-2">
					<button onclick={() => facilityStore.reset()}
						class="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-400 hover:text-white">
						Reset to Defaults
					</button>
					<button onclick={() => { mode = 'add'; editingFacility = undefined; }}
						class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500">
						+ Add Facility
					</button>
				</div>
			{/if}
		</div>
	</header>

	<main class="mx-auto max-w-6xl px-6 py-6">
		{#if mode === 'list'}
			<!-- Search -->
			<input
				type="text"
				placeholder="Search facilities..."
				bind:value={searchQuery}
				class="mb-4 w-full max-w-md rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
			/>

			<p class="mb-4 text-sm text-gray-400">{filtered.length} facilities</p>

			<!-- Table -->
			<div class="overflow-x-auto rounded-lg border border-gray-800">
				<table class="w-full text-left text-sm">
					<thead class="border-b border-gray-800 bg-gray-900">
						<tr>
							<th class="px-4 py-3 font-medium text-gray-400">Name</th>
							<th class="px-4 py-3 font-medium text-gray-400">Location</th>
							<th class="px-4 py-3 font-medium text-gray-400">Rating</th>
							<th class="px-4 py-3 font-medium text-gray-400">Beds</th>
							<th class="px-4 py-3 font-medium text-gray-400">Status</th>
							<th class="px-4 py-3 font-medium text-gray-400 text-right">Actions</th>
						</tr>
					</thead>
					<tbody>
						{#each filtered as facility (facility.id)}
							<tr class="border-b border-gray-800/50 last:border-0">
								<td class="px-4 py-3">
									<span class="text-white">{facility.name}</span>
									<span class="block text-xs text-gray-500">{facility.provider}</span>
								</td>
								<td class="px-4 py-3 text-gray-300">{facility.suburb}, {facility.state}</td>
								<td class="px-4 py-3 text-yellow-400">
									{'&#9733;'.repeat(facility.starRating)}{'&#9733;'.repeat(5 - facility.starRating).replace(/&#9733;/g, '')}
									<span class="text-gray-500">{facility.starRating}/5</span>
								</td>
								<td class="px-4 py-3 text-gray-300">
									{facility.availableBeds}/{facility.totalBeds}
								</td>
								<td class="px-4 py-3">
									<span class="rounded-full px-2 py-0.5 text-xs font-medium
										{facility.complianceStatus === 'Met'
											? 'bg-green-900/50 text-green-400'
											: facility.complianceStatus === 'Not Met'
												? 'bg-red-900/50 text-red-400'
												: 'bg-yellow-900/50 text-yellow-400'}">
										{facility.complianceStatus}
									</span>
								</td>
								<td class="px-4 py-3 text-right">
									{#if deleteConfirmId === facility.id}
										<span class="mr-2 text-xs text-red-400">Delete?</span>
										<button onclick={() => handleDelete(facility.id)}
											class="mr-1 text-xs text-red-400 hover:text-red-300">Yes</button>
										<button onclick={() => (deleteConfirmId = null)}
											class="text-xs text-gray-500 hover:text-white">No</button>
									{:else}
										<button onclick={() => startEdit(facility)}
											class="mr-3 text-sm text-blue-400 hover:text-blue-300">Edit</button>
										<button onclick={() => (deleteConfirmId = facility.id)}
											class="text-sm text-red-400 hover:text-red-300">Delete</button>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			{#if filtered.length === 0}
				<p class="mt-8 text-center text-gray-500">No facilities found.</p>
			{/if}
		{:else}
			<div class="rounded-lg border border-gray-800 bg-gray-900 p-6">
				<FacilityForm
					facility={editingFacility}
					onSubmit={handleSubmit}
					onCancel={handleCancel}
				/>
			</div>
		{/if}
	</main>
</div>
