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

<div class="min-h-screen bg-warm-50 text-warm-900">
	<header class="border-b border-warm-200 bg-white/80 px-6 py-4 backdrop-blur">
		<div class="mx-auto flex max-w-6xl items-center justify-between">
			<div>
				<a href="/" class="text-sm text-accent-600 hover:text-accent-700">&larr; Back to site</a>
				<h1 class="mt-1 text-2xl font-bold text-warm-800">Manage Facilities</h1>
			</div>
			{#if mode === 'list'}
				<div class="flex gap-2">
					<button onclick={() => facilityStore.reset()}
						class="rounded-lg border border-warm-300 px-4 py-2 text-sm text-warm-500 hover:text-warm-800">
						Reset to Defaults
					</button>
					<button onclick={() => { mode = 'add'; editingFacility = undefined; }}
						class="rounded-lg bg-accent-600 px-4 py-2 text-sm font-medium text-white hover:bg-accent-500">
						+ Add Facility
					</button>
				</div>
			{/if}
		</div>
	</header>

	<main class="mx-auto max-w-6xl px-6 py-6">
		{#if mode === 'list'}
			<input
				type="text"
				placeholder="Search facilities..."
				bind:value={searchQuery}
				class="mb-4 w-full max-w-md rounded-lg border border-warm-200 bg-white px-4 py-2.5 text-sm text-warm-800 placeholder-warm-400 focus:border-accent-500 focus:outline-none"
			/>

			<p class="mb-4 text-sm text-warm-500">{filtered.length} facilities</p>

			<div class="overflow-x-auto rounded-lg border border-warm-200 bg-white shadow-sm">
				<table class="w-full text-left text-sm">
					<thead class="border-b border-warm-200 bg-warm-50">
						<tr>
							<th class="px-4 py-3 font-medium text-warm-500">Name</th>
							<th class="px-4 py-3 font-medium text-warm-500">Location</th>
							<th class="px-4 py-3 font-medium text-warm-500">Rating</th>
							<th class="px-4 py-3 font-medium text-warm-500">Beds</th>
							<th class="px-4 py-3 font-medium text-warm-500">Status</th>
							<th class="px-4 py-3 font-medium text-warm-500 text-right">Actions</th>
						</tr>
					</thead>
					<tbody>
						{#each filtered as facility (facility.id)}
							<tr class="border-b border-warm-100 last:border-0">
								<td class="px-4 py-3">
									<span class="text-warm-800">{facility.name}</span>
									<span class="block text-xs text-warm-400">{facility.provider}</span>
								</td>
								<td class="px-4 py-3 text-warm-600">{facility.suburb}, {facility.state}</td>
								<td class="px-4 py-3 text-amber-500">
									{facility.starRating}/5
								</td>
								<td class="px-4 py-3 text-warm-600">
									{facility.availableBeds}/{facility.totalBeds}
								</td>
								<td class="px-4 py-3">
									<span class="rounded-full px-2 py-0.5 text-xs font-medium
										{facility.complianceStatus === 'Met'
											? 'bg-green-100 text-green-700'
											: facility.complianceStatus === 'Not Met'
												? 'bg-red-100 text-red-700'
												: 'bg-yellow-100 text-yellow-700'}">
										{facility.complianceStatus}
									</span>
								</td>
								<td class="px-4 py-3 text-right">
									{#if deleteConfirmId === facility.id}
										<span class="mr-2 text-xs text-red-600">Delete?</span>
										<button onclick={() => handleDelete(facility.id)}
											class="mr-1 text-xs text-red-600 hover:text-red-800">Yes</button>
										<button onclick={() => (deleteConfirmId = null)}
											class="text-xs text-warm-400 hover:text-warm-800">No</button>
									{:else}
										<button onclick={() => startEdit(facility)}
											class="mr-3 text-sm text-accent-600 hover:text-accent-700">Edit</button>
										<button onclick={() => (deleteConfirmId = facility.id)}
											class="text-sm text-red-500 hover:text-red-700">Delete</button>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			{#if filtered.length === 0}
				<p class="mt-8 text-center text-warm-400">No facilities found.</p>
			{/if}
		{:else}
			<div class="rounded-lg border border-warm-200 bg-white p-6 shadow-sm">
				<FacilityForm
					facility={editingFacility}
					onSubmit={handleSubmit}
					onCancel={handleCancel}
				/>
			</div>
		{/if}
	</main>
</div>
