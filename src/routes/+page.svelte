<script lang="ts">
	import { incidentStore } from '$lib/data/store.svelte';
	import type { Incident } from '$lib/data/incidents';
	import { allTypes, allDrivers, allTeamLeaders, allActions } from '$lib/data/incidents';
	import IncidentForm from '$lib/components/IncidentForm.svelte';

	let { data } = $props();

	// Initialize store with server-loaded data + supabase client for mutations
	$effect(() => {
		if (data.supabase && data.incidents) {
			incidentStore.initFromServer(data.supabase, data.incidents);
		}
	});

	let search = $state('');
	let filterType = $state('');
	let filterDriver = $state('');
	let filterTeamLeader = $state('');
	let filterAction = $state('');
	let sortBy = $state<'date-desc' | 'date-asc'>('date-desc');

	// Admin/CRUD state (moved from admin page)
	let mode = $state<'list' | 'add' | 'edit'>('list');
	let editingIncident = $state<Incident | undefined>(undefined);
	let deleteConfirmId = $state<string | null>(null);
	let showDiscardModal = $state(false);
	let formUnsavedChanges = $state(false);

	function formatDate(dateStr: string) {
		if (!dateStr) return '';
		const d = new Date(dateStr);
		return d.toLocaleDateString('en-AU', { day: '2-digit', month: '2-digit', year: 'numeric' });
	}

	const filtered = $derived.by(() => {
		let result = incidentStore.list.filter((i) => {
			const q = search.toLowerCase();
			if (q && !i.referenceNo.toLowerCase().includes(q) && !i.referenceText.toLowerCase().includes(q) && !i.driver.toLowerCase().includes(q) && !i.type.toLowerCase().includes(q) && !i.response.toLowerCase().includes(q)) return false;
			if (filterType && i.type !== filterType) return false;
			if (filterDriver && i.driver !== filterDriver) return false;
			if (filterTeamLeader && i.teamLeader !== filterTeamLeader) return false;
			if (filterAction && i.action !== filterAction) return false;
			return true;
		});

		result.sort((a, b) => {
			switch (sortBy) {
				case 'date-desc': return `${b.dateReceived}T${b.time}`.localeCompare(`${a.dateReceived}T${a.time}`);
				case 'date-asc': return `${a.dateReceived}T${a.time}`.localeCompare(`${b.dateReceived}T${b.time}`);
				default: return 0;
			}
		});

		return result;
	});

	function clearFilters() {
		search = '';
		filterType = '';
		filterDriver = '';
		filterTeamLeader = '';
		filterAction = '';
		sortBy = 'date-desc';
	}

	const hasFilters = $derived(search || filterType || filterDriver || filterTeamLeader || filterAction);

	// Helper to give each incident type a unique colored pill
	function getTypePillClass(type: string): string {
		const lower = type.toLowerCase();
		if (lower.includes('delivery') || lower.includes('redelivery')) return 'bg-blue-100 text-blue-700 border-blue-200';
		if (lower.includes('complaint') || lower.includes('disputed')) return 'bg-orange-100 text-orange-700 border-orange-200';
		if (lower.includes('feedback')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
		if (lower.includes('incident') || lower.includes('report')) return 'bg-purple-100 text-purple-700 border-purple-200';
		if (lower.includes('investigation')) return 'bg-amber-100 text-amber-700 border-amber-200';
		if (lower.includes('missing')) return 'bg-rose-100 text-rose-700 border-rose-200';
		if (lower.includes('stop') || lower.includes('carding')) return 'bg-red-100 text-red-700 border-red-200';
		return 'bg-warm-100 text-warm-700 border-warm-200';
	}

	// CRUD handlers (moved from admin page)
	function startEdit(incident: Incident) {
		editingIncident = incident;
		mode = 'edit';
	}

	async function handleSubmit(incident: Incident) {
		if (mode === 'edit' && editingIncident) {
			await incidentStore.update(editingIncident.id, incident);
		} else {
			await incidentStore.add(incident, data.user?.id);
		}
		mode = 'list';
		editingIncident = undefined;
	}

	async function handleDelete(id: string) {
		await incidentStore.delete(id);
		deleteConfirmId = null;
	}

	function handleCancel() {
		mode = 'list';
		editingIncident = undefined;
	}

	function handleBackdropClick() {
		if (formUnsavedChanges) {
			showDiscardModal = true;
		} else {
			handleCancel();
		}
	}

	function confirmDiscard() {
		showDiscardModal = false;
		handleCancel();
	}
</script>

<svelte:head>
	<title>JCH Pham AusPost Incident Tracker | Australia Post</title>
</svelte:head>

<div class="flex-1 flex flex-col bg-warm-50 text-warm-900 overflow-hidden">
	<header class="border-b border-warm-200 bg-white/80 px-6 py-5 backdrop-blur flex-shrink-0">
		<div class="mx-auto max-w-[1600px]">
			<div class="flex items-center justify-between">
				<div>
					<h1 class="text-2xl font-bold text-warm-800">JCH Pham AusPost Incident Tracker</h1>
					{#if incidentStore.error}
						<p class="mt-1 text-sm text-red-600 font-medium">{incidentStore.error}</p>
					{:else}
						<p class="mt-1 text-sm text-warm-500">
							{incidentStore.list.length} incidents recorded
						</p>
					{/if}
				</div>
				{#if mode === 'list'}
					<button onclick={() => { mode = 'add'; editingIncident = undefined; }}
						class="rounded-lg bg-accent-600 px-4 py-2 text-sm font-medium text-white hover:bg-accent-500 transition">
						+ Add Incident
					</button>
				{/if}
			</div>
		</div>
	</header>

	<!-- Filters -->
	{#if incidentStore.isLoading}
		<div class="flex items-center justify-center py-12">
			<div class="flex flex-col items-center">
				<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-warm-600"></div>
				<p class="mt-3 text-sm text-warm-500">Loading incidents from database...</p>
			</div>
		</div>
	{:else if incidentStore.error}
		<div class="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
			<p class="text-red-600 mb-4">⚠️ {incidentStore.error}</p>
			<button
				onclick={() => incidentStore.reload(data.user?.id)}
				class="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition"
			>
				Try Again
			</button>
		</div>
	{:else}
		<div class="rounded-lg border border-warm-200 bg-white p-5 shadow-sm">
			<div class="flex flex-wrap gap-3">
				<input
					type="text"
					placeholder="Search ref, driver, type..."
					bind:value={search}
					class="w-full max-w-xs rounded-lg border border-warm-200 bg-warm-50 px-4 py-2 text-sm text-warm-800 placeholder-warm-400 focus:border-accent-500 focus:outline-none"
				/>
				<select bind:value={filterType} class="rounded-lg border border-warm-200 bg-warm-50 px-3 py-2 text-sm text-warm-700 focus:border-accent-500 focus:outline-none">
					<option value="">All Types</option>
					{#each allTypes as t}<option value={t}>{t}</option>{/each}
				</select>
				<select bind:value={filterDriver} class="rounded-lg border border-warm-200 bg-warm-50 px-3 py-2 text-sm text-warm-700 focus:border-accent-500 focus:outline-none">
					<option value="">All Drivers</option>
					{#each allDrivers as d}<option value={d}>{d}</option>{/each}
				</select>
				<select bind:value={filterTeamLeader} class="rounded-lg border border-warm-200 bg-warm-50 px-3 py-2 text-sm text-warm-700 focus:border-accent-500 focus:outline-none">
					<option value="">All Team Leaders</option>
					{#each allTeamLeaders as tl}<option value={tl}>{tl}</option>{/each}
				</select>
				<select bind:value={filterAction} class="rounded-lg border border-warm-200 bg-warm-50 px-3 py-2 text-sm text-warm-700 focus:border-accent-500 focus:outline-none">
					<option value="">All Actions</option>
					{#each allActions as a}<option value={a}>{a}</option>{/each}
				</select>
				<button onclick={() => { sortBy = sortBy === 'date-desc' ? 'date-asc' : 'date-desc'; }}
					class="rounded-lg border border-warm-200 bg-warm-50 px-4 py-2 text-sm text-warm-700 hover:bg-warm-100 focus:border-accent-500 focus:outline-none flex items-center gap-1">
					<span>Date Received</span>
					<span class="text-xs">{sortBy === 'date-desc' ? '↓' : '↑'}</span>
				</button>
				{#if hasFilters}
					<button onclick={clearFilters} class="text-sm text-accent-600 hover:text-accent-700">Clear</button>
				{/if}
			</div>
			<p class="mt-3 text-sm text-warm-500">{filtered.length} {filtered.length === 1 ? 'incident' : 'incidents'} found</p>
		</div>
	{/if}

	<!-- Table Container - scrollable body -->
	<div class="flex-1 min-h-0 mt-4 overflow-hidden flex flex-col">
		<div class="flex-1 overflow-auto rounded-lg border border-warm-200 bg-white shadow-sm" style="max-height: calc(100vh - 280px);">
			<table class="w-full text-left text-sm min-w-[1400px]">
				<thead class="border-b border-warm-200 bg-warm-50 sticky top-0">
					<tr>
						<th class="px-4 py-3 font-medium text-warm-500 whitespace-nowrap">Date</th>
						<th class="px-4 py-3 font-medium text-warm-500 whitespace-nowrap">Time</th>
						<th class="px-4 py-3 font-medium text-warm-500 whitespace-nowrap">Type</th>
						<th class="px-4 py-3 font-medium text-warm-500 whitespace-nowrap">Ref No.</th>
						<th class="px-4 py-3 font-medium text-warm-500 whitespace-nowrap">Driver</th>
						<th class="px-4 py-3 font-medium text-warm-500 whitespace-nowrap">Response</th>
						<th class="px-4 py-3 font-medium text-warm-500 whitespace-nowrap">Responded</th>
						<th class="px-4 py-3 font-medium text-warm-500 whitespace-nowrap">Action</th>
						<th class="px-4 py-3 font-medium text-warm-500 whitespace-nowrap text-right">Record Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each filtered as incident (incident.id)}
						<tr class="border-b border-warm-100 last:border-0 hover:bg-warm-50/50">
							<td class="px-4 py-3 whitespace-nowrap text-warm-700">{formatDate(incident.dateReceived)}</td>
							<td class="px-4 py-3 whitespace-nowrap text-warm-600">{incident.time}</td>
							<td class="px-4 py-3 whitespace-nowrap">
								<span class="inline-flex items-center gap-1">
									{#if incident.marked === 'High'}
										<span class="rounded bg-red-100 px-1.5 py-0.5 text-xs font-semibold text-red-700">HIGH</span>
									{/if}
									<span class="inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium border {getTypePillClass(incident.type)}">
										{incident.type}
									</span>
								</span>
							</td>
							<td class="px-4 py-3 whitespace-nowrap font-mono text-xs text-warm-600">{incident.referenceNo}</td>
							<td class="px-4 py-3 whitespace-nowrap font-mono text-xs text-warm-700">{incident.driver}</td>
							<td class="px-4 py-3 whitespace-nowrap text-warm-600">{incident.response}</td>
							<td class="px-4 py-3 whitespace-nowrap text-warm-500">
								{#if incident.dateResponse}
									{formatDate(incident.dateResponse)} {incident.timeResponse}
								{/if}
							</td>
							<td class="px-4 py-3 whitespace-nowrap">
								{#if incident.action === 'Resolved'}
									<span class="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">Resolved</span>
								{:else if incident.action === 'LIT'}
									<span class="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">LIT</span>
								{:else if incident.action === 'Ack'}
									<span class="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">Ack</span>
								{:else if incident.action === 'LPO'}
									<span class="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">LPO</span>
								{:else if incident.action === 'AP staff'}
									<span class="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">AP staff</span>
								{:else if incident.action}
									<span class="rounded-full bg-warm-100 px-2 py-0.5 text-xs font-medium text-warm-600">{incident.action}</span>
								{:else}
									<span class="text-warm-300">-</span>
								{/if}
							</td>
							<td class="px-4 py-3 text-right whitespace-nowrap">
								{#if deleteConfirmId === incident.id}
									<span class="mr-2 text-xs text-red-600">Delete?</span>
									<button onclick={() => handleDelete(incident.id)}
										class="mr-1 px-3 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded font-medium">Yes</button>
									<button onclick={() => (deleteConfirmId = null)}
										class="px-3 py-1 text-xs bg-warm-100 hover:bg-warm-200 text-warm-700 rounded">No</button>
								{:else}
									<button onclick={() => startEdit(incident)}
										class="mr-2 px-3 py-1 text-sm bg-accent-100 hover:bg-accent-200 text-accent-700 rounded border border-accent-200">Edit</button>
									<button onclick={() => (deleteConfirmId = incident.id)}
										class="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded">Delete</button>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>

	{#if filtered.length === 0}
		<div class="mt-12 text-center">
			<p class="text-lg text-warm-400">No incidents match your filters.</p>
			<button onclick={clearFilters} class="mt-3 text-accent-600 hover:text-accent-700">Clear all filters</button>
		</div>
	{/if}

	<!-- Slide-over panel for Add/Edit (from right edge) -->
	{#if mode !== 'list'}
		<!-- Backdrop -->
		<div class="fixed inset-0 bg-black/50 z-50" onclick={handleBackdropClick} role="button" tabindex="0" onkeydown={(e) => e.key === 'Escape' && handleBackdropClick()}></div>
		<!-- Panel -->
		<div class="fixed top-0 bottom-0 right-0 w-full max-w-lg bg-white shadow-2xl border-l border-warm-200 transform transition-transform duration-300 ease-in-out z-[60] overflow-auto p-5"
               style="transform: translateX(0);">
			<IncidentForm
				incident={editingIncident}
				onSubmit={handleSubmit}
				onCancel={handleCancel}
				onUnsavedChangesChange={(hasChanges) => { formUnsavedChanges = hasChanges; }}
			/>
		</div>

		<!-- Unsaved Changes Warning -->
		{#if showDiscardModal}
			<div class="fixed inset-0 z-[70] flex items-center justify-center bg-black/50">
				<div class="rounded-lg bg-white p-6 shadow-xl">
					<h3 class="mb-2 text-lg font-semibold text-warm-800">Unsaved Changes</h3>
					<p class="mb-6 text-sm text-warm-600">You have unsaved changes. Are you sure you want to discard them?</p>
					<div class="flex gap-3 justify-end">
						<button type="button" onclick={() => { showDiscardModal = false; }}
							class="rounded-lg border border-warm-200 px-4 py-2 text-sm text-warm-700 hover:bg-warm-50">
							Keep Editing
						</button>
						<button type="button" onclick={confirmDiscard}
							class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
							Discard Changes
						</button>
					</div>
				</div>
			</div>
		{/if}
	{/if}
</div>
