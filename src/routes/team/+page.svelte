<script lang="ts">
	import { teamStore } from '$lib/data/teamStore.svelte';
	import type { TeamLeader, Driver } from '$lib/data/team';
	import { v4 as uuidv4 } from 'uuid';

	let { data } = $props();

	// Initialize store with server-loaded data
	$effect(() => {
		if (data.supabase && data.teamLeaders && data.drivers) {
			teamStore.initFromServer(data.supabase, data.teamLeaders, data.drivers);
		}
	});

	// UI state
	let activeTab = $state<'leaders' | 'drivers'>('leaders');
	let showLeaderForm = $state(false);
	let showDriverForm = $state(false);
	let editingLeader = $state<TeamLeader | undefined>(undefined);
	let editingDriver = $state<Driver | undefined>(undefined);
	let deleteConfirmId = $state<string | null>(null);
	let deleteConfirmType = $state<'leader' | 'driver'>('leader');

	// Form data
	let leaderForm = $state({
		name: '',
		email: '',
		phone: ''
	});

	let driverForm = $state({
		name: '',
		username: '',
		email: '',
		phone: '',
		teamLeaderId: ''
	});

	// Reset leader form
	function resetLeaderForm() {
		leaderForm = { name: '', email: '', phone: '' };
		editingLeader = undefined;
		showLeaderForm = false;
	}

	// Reset driver form
	function resetDriverForm() {
		driverForm = { name: '', username: '', email: '', phone: '', teamLeaderId: '' };
		editingDriver = undefined;
		showDriverForm = false;
	}

	// Open leader form for editing
	function startEditLeader(leader: TeamLeader) {
		editingLeader = leader;
		leaderForm = { name: leader.name, email: leader.email || '', phone: leader.phone || '' };
		showLeaderForm = true;
	}

	// Open driver form for editing
	function startEditDriver(driver: Driver) {
		editingDriver = driver;
		driverForm = {
			name: driver.name,
			username: driver.username,
			email: driver.email || '',
			phone: driver.phone || '',
			teamLeaderId: driver.teamLeaderId || ''
		};
		showDriverForm = true;
	}

	// Save team leader
	async function saveTeamLeader() {
		if (!leaderForm.name.trim()) {
			alert('Please enter a team leader name');
			return;
		}

		const leader: TeamLeader = {
			id: editingLeader?.id || uuidv4(),
			name: leaderForm.name.trim(),
			email: leaderForm.email.trim() || undefined,
			phone: leaderForm.phone.trim() || undefined
		};

		const success = editingLeader
			? await teamStore.updateTeamLeader(editingLeader.id, leader)
			: await teamStore.addTeamLeader(leader, data.user?.id);

		if (success) {
			resetLeaderForm();
		} else {
			alert('Failed to save team leader');
		}
	}

	// Save driver
	async function saveDriver() {
		if (!driverForm.name.trim() || !driverForm.username.trim()) {
			alert('Please enter driver name and username');
			return;
		}

		const driver: Driver = {
			id: editingDriver?.id || uuidv4(),
			name: driverForm.name.trim(),
			username: driverForm.username.trim(),
			email: driverForm.email.trim() || undefined,
			phone: driverForm.phone.trim() || undefined,
			teamLeaderId: driverForm.teamLeaderId || undefined
		};

		const success = editingDriver
			? await teamStore.updateDriver(editingDriver.id, driver)
			: await teamStore.addDriver(driver, data.user?.id);

		if (success) {
			resetDriverForm();
		} else {
			alert('Failed to save driver');
		}
	}

	// Delete team leader
	async function deleteLeader(id: string) {
		const success = await teamStore.deleteTeamLeader(id);
		if (success) {
			deleteConfirmId = null;
		} else {
			alert('Failed to delete team leader');
		}
	}

	// Delete driver
	async function deleteDriver(id: string) {
		const success = await teamStore.deleteDriver(id);
		if (success) {
			deleteConfirmId = null;
		} else {
			alert('Failed to delete driver');
		}
	}
</script>

<svelte:head>
	<title>Team Management | Incident Tracker</title>
</svelte:head>

<div class="flex-1 flex flex-col bg-warm-50 text-warm-900 overflow-hidden">
	<header class="border-b border-warm-200 bg-white/80 px-6 py-5 backdrop-blur flex-shrink-0">
		<div class="mx-auto max-w-[1600px]">
			<h1 class="text-2xl font-bold text-warm-800">Team Management</h1>
			<p class="mt-1 text-sm text-warm-500">Manage team leaders and drivers</p>
		</div>
	</header>

	{#if teamStore.isLoading}
		<div class="flex items-center justify-center py-12">
			<div class="flex flex-col items-center">
				<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-warm-600"></div>
				<p class="mt-3 text-sm text-warm-500">Loading team data...</p>
			</div>
		</div>
	{:else if teamStore.error}
		<div class="rounded-lg border border-red-200 bg-red-50 p-8 text-center m-6">
			<p class="text-red-600 mb-4">⚠️ {teamStore.error}</p>
			<button
				onclick={() => teamStore.reload(data.user?.id)}
				class="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition"
			>
				Try Again
			</button>
		</div>
	{:else}
		<div class="flex-1 overflow-auto">
			<div class="mx-auto max-w-[1600px] px-6 py-6">
				<!-- Tabs -->
				<div class="flex gap-4 mb-6 border-b border-warm-200">
					<button
						onclick={() => activeTab = 'leaders'}
						class="px-4 py-3 font-medium transition {activeTab === 'leaders'
							? 'text-accent-600 border-b-2 border-accent-600'
							: 'text-warm-600 hover:text-warm-800'}"
					>
						👥 Team Leaders ({teamStore.teamLeaders.length})
					</button>
					<button
						onclick={() => activeTab = 'drivers'}
						class="px-4 py-3 font-medium transition {activeTab === 'drivers'
							? 'text-accent-600 border-b-2 border-accent-600'
							: 'text-warm-600 hover:text-warm-800'}"
					>
						🚗 Drivers ({teamStore.drivers.length})
					</button>
				</div>

				<!-- Team Leaders Tab -->
				{#if activeTab === 'leaders'}
					<div class="space-y-6">
						{#if !showLeaderForm}
							<button
								onclick={() => showLeaderForm = true}
								class="rounded-lg bg-accent-600 px-4 py-2 text-sm font-medium text-white hover:bg-accent-500 transition"
							>
								+ Add Team Leader
							</button>
						{:else}
							<div class="rounded-lg border border-warm-200 bg-white p-6 shadow-sm">
								<h2 class="mb-4 text-lg font-semibold text-warm-800">
									{editingLeader ? 'Edit Team Leader' : 'Add Team Leader'}
								</h2>
								<div class="space-y-4">
									<div>
										<label for="leader-name" class="block text-sm font-medium text-warm-700 mb-1">Name *</label>
										<input
											id="leader-name"
											type="text"
											bind:value={leaderForm.name}
											placeholder="e.g., John Smith"
											class="w-full rounded-lg border border-warm-200 bg-warm-50 px-4 py-2 text-sm text-warm-800 placeholder-warm-400 focus:border-accent-500 focus:outline-none"
										/>
									</div>
									<div>
										<label for="leader-email" class="block text-sm font-medium text-warm-700 mb-1">Email</label>
										<input
											id="leader-email"
											type="email"
											bind:value={leaderForm.email}
											placeholder="john@example.com"
											class="w-full rounded-lg border border-warm-200 bg-warm-50 px-4 py-2 text-sm text-warm-800 placeholder-warm-400 focus:border-accent-500 focus:outline-none"
										/>
									</div>
									<div>
										<label for="leader-phone" class="block text-sm font-medium text-warm-700 mb-1">Phone</label>
										<input
											id="leader-phone"
											type="tel"
											bind:value={leaderForm.phone}
											placeholder="0412 345 678"
											class="w-full rounded-lg border border-warm-200 bg-warm-50 px-4 py-2 text-sm text-warm-800 placeholder-warm-400 focus:border-accent-500 focus:outline-none"
										/>
									</div>
									<div class="flex gap-3 justify-end pt-4">
										<button
											type="button"
											onclick={resetLeaderForm}
											class="rounded-lg border border-warm-200 px-4 py-2 text-sm text-warm-700 hover:bg-warm-50 transition"
										>
											Cancel
										</button>
										<button
											type="button"
											onclick={saveTeamLeader}
											class="rounded-lg bg-accent-600 px-4 py-2 text-sm font-medium text-white hover:bg-accent-500 transition"
										>
											{editingLeader ? 'Update' : 'Add'} Team Leader
										</button>
									</div>
								</div>
							</div>
						{/if}

						<!-- Team Leaders List -->
						<div class="rounded-lg border border-warm-200 bg-white shadow-sm overflow-hidden">
							{#if teamStore.teamLeaders.length === 0}
								<div class="p-8 text-center">
									<p class="text-warm-500">No team leaders yet. Add one to get started.</p>
								</div>
							{:else}
								<table class="w-full text-left text-sm">
									<thead class="border-b border-warm-200 bg-warm-50">
										<tr>
											<th class="px-6 py-3 font-medium text-warm-600">Name</th>
											<th class="px-6 py-3 font-medium text-warm-600">Email</th>
											<th class="px-6 py-3 font-medium text-warm-600">Phone</th>
											<th class="px-6 py-3 font-medium text-warm-600 text-right">Actions</th>
										</tr>
									</thead>
									<tbody>
										{#each teamStore.teamLeaders as leader (leader.id)}
											<tr class="border-b border-warm-100 last:border-0 hover:bg-warm-50/50">
												<td class="px-6 py-3 font-medium text-warm-800">{leader.name}</td>
												<td class="px-6 py-3 text-warm-600">{leader.email || '-'}</td>
												<td class="px-6 py-3 text-warm-600">{leader.phone || '-'}</td>
												<td class="px-6 py-3 text-right whitespace-nowrap">
													{#if deleteConfirmId === leader.id && deleteConfirmType === 'leader'}
														<span class="mr-2 text-xs text-red-600">Delete?</span>
														<button
															onclick={() => deleteLeader(leader.id)}
															class="mr-2 px-3 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded font-medium"
														>
															Yes
														</button>
														<button
															onclick={() => (deleteConfirmId = null)}
															class="px-3 py-1 text-xs bg-warm-100 hover:bg-warm-200 text-warm-700 rounded"
														>
															No
														</button>
													{:else}
														<button
															onclick={() => startEditLeader(leader)}
															class="mr-2 px-3 py-1 text-sm bg-accent-100 hover:bg-accent-200 text-accent-700 rounded border border-accent-200"
														>
															Edit
														</button>
														<button
															onclick={() => {
																deleteConfirmId = leader.id;
																deleteConfirmType = 'leader';
															}}
															class="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded"
														>
															Delete
														</button>
													{/if}
												</td>
											</tr>
										{/each}
									</tbody>
								</table>
							{/if}
						</div>
					</div>

				<!-- Drivers Tab -->
				{:else if activeTab === 'drivers'}
					<div class="space-y-6">
						{#if !showDriverForm}
							<button
								onclick={() => showDriverForm = true}
								class="rounded-lg bg-accent-600 px-4 py-2 text-sm font-medium text-white hover:bg-accent-500 transition"
							>
								+ Add Driver
							</button>
						{:else}
							<div class="rounded-lg border border-warm-200 bg-white p-6 shadow-sm">
								<h2 class="mb-4 text-lg font-semibold text-warm-800">
									{editingDriver ? 'Edit Driver' : 'Add Driver'}
								</h2>
								<div class="space-y-4">
									<div class="grid grid-cols-2 gap-4">
										<div>
											<label for="driver-name" class="block text-sm font-medium text-warm-700 mb-1">Name *</label>
											<input
												id="driver-name"
												type="text"
												bind:value={driverForm.name}
												placeholder="e.g., Jane Smith"
												class="w-full rounded-lg border border-warm-200 bg-warm-50 px-4 py-2 text-sm text-warm-800 placeholder-warm-400 focus:border-accent-500 focus:outline-none"
											/>
										</div>
										<div>
											<label for="driver-username" class="block text-sm font-medium text-warm-700 mb-1">Username *</label>
											<input
												id="driver-username"
												type="text"
												bind:value={driverForm.username}
												placeholder="e.g., SMITHJ1"
												class="w-full rounded-lg border border-warm-200 bg-warm-50 px-4 py-2 text-sm text-warm-800 placeholder-warm-400 focus:border-accent-500 focus:outline-none"
											/>
										</div>
									</div>
									<div class="grid grid-cols-2 gap-4">
										<div>
											<label for="driver-email" class="block text-sm font-medium text-warm-700 mb-1">Email</label>
											<input
												id="driver-email"
												type="email"
												bind:value={driverForm.email}
												placeholder="jane@example.com"
												class="w-full rounded-lg border border-warm-200 bg-warm-50 px-4 py-2 text-sm text-warm-800 placeholder-warm-400 focus:border-accent-500 focus:outline-none"
											/>
										</div>
										<div>
											<label for="driver-phone" class="block text-sm font-medium text-warm-700 mb-1">Phone</label>
											<input
												id="driver-phone"
												type="tel"
												bind:value={driverForm.phone}
												placeholder="0412 345 678"
												class="w-full rounded-lg border border-warm-200 bg-warm-50 px-4 py-2 text-sm text-warm-800 placeholder-warm-400 focus:border-accent-500 focus:outline-none"
											/>
										</div>
									</div>
									<div>
										<label for="driver-leader" class="block text-sm font-medium text-warm-700 mb-1">Team Leader</label>
										<select
											id="driver-leader"
											bind:value={driverForm.teamLeaderId}
											class="w-full rounded-lg border border-warm-200 bg-warm-50 px-4 py-2 text-sm text-warm-700 focus:border-accent-500 focus:outline-none"
										>
											<option value="">-- Unassigned --</option>
											{#each teamStore.teamLeaders as leader}
												<option value={leader.id}>{leader.name}</option>
											{/each}
										</select>
									</div>
									<div class="flex gap-3 justify-end pt-4">
										<button
											type="button"
											onclick={resetDriverForm}
											class="rounded-lg border border-warm-200 px-4 py-2 text-sm text-warm-700 hover:bg-warm-50 transition"
										>
											Cancel
										</button>
										<button
											type="button"
											onclick={saveDriver}
											class="rounded-lg bg-accent-600 px-4 py-2 text-sm font-medium text-white hover:bg-accent-500 transition"
										>
											{editingDriver ? 'Update' : 'Add'} Driver
										</button>
									</div>
								</div>
							</div>
						{/if}

						<!-- Drivers List -->
						<div class="rounded-lg border border-warm-200 bg-white shadow-sm overflow-hidden">
							{#if teamStore.drivers.length === 0}
								<div class="p-8 text-center">
									<p class="text-warm-500">No drivers yet. Add one to get started.</p>
								</div>
							{:else}
								<table class="w-full text-left text-sm">
									<thead class="border-b border-warm-200 bg-warm-50">
										<tr>
											<th class="px-6 py-3 font-medium text-warm-600">Name</th>
											<th class="px-6 py-3 font-medium text-warm-600">Username</th>
											<th class="px-6 py-3 font-medium text-warm-600">Email</th>
											<th class="px-6 py-3 font-medium text-warm-600">Team Leader</th>
											<th class="px-6 py-3 font-medium text-warm-600 text-right">Actions</th>
										</tr>
									</thead>
									<tbody>
										{#each teamStore.drivers as driver (driver.id)}
											{@const leader = teamStore.teamLeaders.find(l => l.id === driver.teamLeaderId)}
											<tr class="border-b border-warm-100 last:border-0 hover:bg-warm-50/50">
												<td class="px-6 py-3 font-medium text-warm-800">{driver.name}</td>
												<td class="px-6 py-3 font-mono text-xs text-warm-600">{driver.username}</td>
												<td class="px-6 py-3 text-warm-600">{driver.email || '-'}</td>
												<td class="px-6 py-3 text-warm-600">{leader?.name || '-'}</td>
												<td class="px-6 py-3 text-right whitespace-nowrap">
													{#if deleteConfirmId === driver.id && deleteConfirmType === 'driver'}
														<span class="mr-2 text-xs text-red-600">Delete?</span>
														<button
															onclick={() => deleteDriver(driver.id)}
															class="mr-2 px-3 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded font-medium"
														>
															Yes
														</button>
														<button
															onclick={() => (deleteConfirmId = null)}
															class="px-3 py-1 text-xs bg-warm-100 hover:bg-warm-200 text-warm-700 rounded"
														>
															No
														</button>
													{:else}
														<button
															onclick={() => startEditDriver(driver)}
															class="mr-2 px-3 py-1 text-sm bg-accent-100 hover:bg-accent-200 text-accent-700 rounded border border-accent-200"
														>
															Edit
														</button>
														<button
															onclick={() => {
																deleteConfirmId = driver.id;
																deleteConfirmType = 'driver';
															}}
															class="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded"
														>
															Delete
														</button>
													{/if}
												</td>
											</tr>
										{/each}
									</tbody>
								</table>
							{/if}
						</div>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
