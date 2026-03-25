<script lang="ts">
	import type { Incident } from '$lib/data/incidents';
	import { allTypes, allDrivers, allTeamLeaders, allActions } from '$lib/data/incidents';

	interface Props {
		incident?: Incident;
		onSubmit: (incident: Incident) => void;
		onCancel: () => void;
		onUnsavedChangesChange?: (hasChanges: boolean) => void;
	}

	let { incident, onSubmit, onCancel, onUnsavedChangesChange }: Props = $props();

	const isEdit = $derived(!!incident);
	let showConfirm = $state(false);
	let showDiscardWarning = $state(false);

	let form = $state<Incident>({
		id: '',
		dateReceived: '',
		time: '',
		sender: 'Caringbah Cust Exp',
		teamLeader: 'Andrew Tran',
		type: 'Disputed Delivery',
		marked: '',
		referenceNo: '',
		referenceText: '',
		driver: '',
		response: '',
		dateResponse: '',
		timeResponse: '',
		action: ''
	});

	// Check if form has unsaved changes
	const hasUnsavedChanges = $derived.by(() => {
		if (!incident) {
			// For new incidents, check if any required fields are filled
			return (
				form.dateReceived ||
				form.time ||
				form.sender !== 'Caringbah Cust Exp' ||
				form.teamLeader !== 'Andrew Tran' ||
				form.type !== 'Disputed Delivery' ||
				form.marked ||
				form.referenceNo ||
				form.referenceText ||
				form.driver ||
				form.response ||
				form.dateResponse ||
				form.timeResponse ||
				form.action
			);
		}
		// For edits, check if any field differs from original
		return (
			form.dateReceived !== incident.dateReceived ||
			form.time !== incident.time ||
			form.sender !== incident.sender ||
			form.teamLeader !== incident.teamLeader ||
			form.type !== incident.type ||
			form.marked !== incident.marked ||
			form.referenceNo !== incident.referenceNo ||
			form.referenceText !== incident.referenceText ||
			form.driver !== incident.driver ||
			form.response !== incident.response ||
			form.dateResponse !== incident.dateResponse ||
			form.timeResponse !== incident.timeResponse ||
			form.action !== incident.action
		);
	});

	// Update parent whenever unsaved changes change
	$effect(() => {
		onUnsavedChangesChange?.(Boolean(hasUnsavedChanges));
	});

	// Reset form when incident prop changes
	$effect(() => {
		if (incident) {
			form = { ...incident };
		} else {
			form = {
				id: crypto.randomUUID(),
				dateReceived: new Date().toISOString().slice(0, 10),
				time: new Date().toTimeString().slice(0, 5),
				sender: 'Caringbah Cust Exp',
				teamLeader: 'Andrew Tran',
				type: 'Disputed Delivery',
				marked: '',
				referenceNo: '',
				referenceText: '',
				driver: '',
				response: '',
				dateResponse: '',
				timeResponse: '',
				action: ''
			};
		}
	});

	function handleSubmit() {
		if (isEdit && !showConfirm) {
			showConfirm = true;
			return;
		}
		onSubmit({ ...form });
		showConfirm = false;
	}

	function handleCancel() {
		if (hasUnsavedChanges) {
			showDiscardWarning = true;
		} else {
			onCancel();
		}
	}

	function handleBackdropClick(e: MouseEvent) {
		// Only handle clicks directly on the backdrop itself
		if (e.target === e.currentTarget) {
			handleCancel();
		}
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			handleCancel();
		}
	}

	function confirmDiscard() {
		showDiscardWarning = false;
		onCancel();
	}

	const inputClass = 'w-full rounded-lg border border-warm-200 bg-warm-50 px-3 py-2 text-sm text-warm-700 focus:border-accent-500 focus:outline-none';
	const labelClass = 'mb-1 block text-sm text-warm-500';
</script>

<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-6">
	<h2 class="text-xl font-semibold text-warm-800">{isEdit ? 'Edit' : 'Add'} Incident</h2>

	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
		<div>
			<label for="dateReceived" class={labelClass}>Date Received *</label>
			<input id="dateReceived" type="date" bind:value={form.dateReceived} required class={inputClass} />
		</div>
		<div>
			<label for="time" class={labelClass}>Time *</label>
			<input id="time" type="time" bind:value={form.time} required class={inputClass} />
		</div>
		<div>
			<label for="sender" class={labelClass}>Sender</label>
			<input id="sender" type="text" bind:value={form.sender} class={inputClass} />
		</div>
		<div>
			<label for="teamLeader" class={labelClass}>Team Leader</label>
			<input id="teamLeader" type="text" bind:value={form.teamLeader} list="teamLeaders" class={inputClass} />
			<datalist id="teamLeaders">
				{#each allTeamLeaders as tl}<option value={tl}>{tl}</option>{/each}
			</datalist>
		</div>
		<div>
			<label for="type" class={labelClass}>Type *</label>
			<input id="type" type="text" bind:value={form.type} list="types" required class={inputClass} />
			<datalist id="types">
				{#each allTypes as t}<option value={t}>{t}</option>{/each}
			</datalist>
		</div>
		<div>
			<label for="marked" class={labelClass}>Marked</label>
			<select id="marked" bind:value={form.marked} class={inputClass}>
				<option value="">None</option>
				<option value="High">High</option>
			</select>
		</div>
		<div>
			<label for="referenceNo" class={labelClass}>Reference No.</label>
			<input id="referenceNo" type="text" bind:value={form.referenceNo} class={inputClass} />
		</div>
		<div class="sm:col-span-2">
			<label for="referenceText" class={labelClass}>Reference Text</label>
			<input id="referenceText" type="text" bind:value={form.referenceText} class={inputClass} />
		</div>
		<div>
			<label for="driver" class={labelClass}>Driver</label>
			<input id="driver" type="text" bind:value={form.driver} list="drivers" class={inputClass} />
			<datalist id="drivers">
				{#each allDrivers as d}<option value={d}>{d}</option>{/each}
			</datalist>
		</div>
		<div>
			<label for="response" class={labelClass}>Response By</label>
			<input id="response" type="text" bind:value={form.response} class={inputClass} />
		</div>
		<div>
			<label for="dateResponse" class={labelClass}>Response Date</label>
			<input id="dateResponse" type="date" bind:value={form.dateResponse} class={inputClass} />
		</div>
		<div>
			<label for="timeResponse" class={labelClass}>Response Time</label>
			<input id="timeResponse" type="time" bind:value={form.timeResponse} class={inputClass} />
		</div>
		<div>
			<label for="action" class={labelClass}>Action</label>
			<input id="action" type="text" bind:value={form.action} list="actions" class={inputClass} />
			<datalist id="actions">
				{#each allActions as a}<option value={a}>{a}</option>{/each}
			</datalist>
		</div>
	</div>

	<div class="flex gap-3 border-t border-warm-200 pt-4">
		{#if isEdit && showConfirm}
			<button type="button" onclick={handleSubmit}
				class="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-500">
				Confirm Update
			</button>
			<button type="button" onclick={() => { showConfirm = false; }}
				class="rounded-lg px-5 py-2 text-sm text-warm-500 hover:text-white">
				Cancel
			</button>
		{:else}
			<button type="submit"
				class="rounded-lg bg-accent-600 px-5 py-2 text-sm font-medium text-white hover:bg-accent-500">
				{isEdit ? 'Update' : 'Add'} Incident
			</button>
			<button type="button" onclick={handleCancel}
				class="rounded-lg px-5 py-2 text-sm text-warm-500 hover:text-white">
				Cancel
			</button>
		{/if}
	</div>

</form>

<!-- Unsaved Changes Warning -->
{#if showDiscardWarning}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
		<div class="rounded-lg bg-white p-6 shadow-xl">
			<h3 class="mb-2 text-lg font-semibold text-warm-800">Unsaved Changes</h3>
			<p class="mb-6 text-sm text-warm-600">You have unsaved changes. Are you sure you want to discard them?</p>
			<div class="flex gap-3 justify-end">
				<button type="button" onclick={() => { showDiscardWarning = false; }}
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
