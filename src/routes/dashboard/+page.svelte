<script lang="ts">
	import { incidentStore } from '$lib/data/store.svelte';
	import type { Chart as ChartJS } from 'chart.js';
	import { Chart, registerables } from 'chart.js';
	import { onMount } from 'svelte';

	// Register Chart.js plugins
	Chart.register(...registerables);

	let { data } = $props();
	let canvasElement: HTMLCanvasElement | undefined = $state();
	let chartInstance: ChartJS | undefined;

	// Initialize store with server-loaded data
	$effect(() => {
		if (data?.supabase && data?.incidents) {
			incidentStore.initFromServer(data.supabase, data.incidents);
		}
	});

	// Group incidents by date and count them
	const incidentsByDate = $derived.by(() => {
		const grouped: Record<string, number> = {};

		incidentStore.list.forEach((incident) => {
			const date = incident.dateReceived;
			grouped[date] = (grouped[date] || 0) + 1;
		});

		// Sort by date and return
		return Object.entries(grouped)
			.sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
			.slice(-30); // Last 30 days
	});

	const chartData = $derived.by(() => ({
		labels: incidentsByDate.map(([date]) => {
			const d = new Date(date);
			return d.toLocaleDateString('en-AU', { month: 'short', day: 'numeric' });
		}),
		datasets: [
			{
				label: 'Incidents',
				data: incidentsByDate.map(([, count]) => count),
				borderColor: '#ea7d5d',
				backgroundColor: 'rgba(234, 125, 93, 0.1)',
				borderWidth: 2,
				fill: true,
				tension: 0.4,
				pointRadius: 4,
				pointBackgroundColor: '#ea7d5d',
				pointBorderColor: '#fff',
				pointBorderWidth: 2,
				pointHoverRadius: 6
			}
		]
	}));

	onMount(async () => {
		// Small delay to ensure DOM is ready
		await new Promise(resolve => setTimeout(resolve, 100));
		
		if (!canvasElement) return

		chartInstance = new Chart(canvasElement, {
			type: 'line',
			data: chartData,
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						display: true,
						labels: {
							usePointStyle: true,
							font: { size: 12 },
							color: '#744d3a'
						}
					},
					tooltip: {
						backgroundColor: 'rgba(0, 0, 0, 0.8)',
						titleFont: { size: 14 },
						bodyFont: { size: 12 },
						padding: 12,
						cornerRadius: 8,
						displayColors: false,
						callbacks: {
							label: (context) => `${context.parsed.y} incidents`
						}
					}
				},
				scales: {
					y: {
						beginAtZero: true,
						ticks: {
							color: '#886644',
							stepSize: 1
						},
						grid: {
							color: 'rgba(136, 102, 68, 0.1)'
						}
					},
					x: {
						ticks: {
							color: '#886644'
						},
						grid: {
							display: false
						}
					}
				}
			}
		});

		// Handle window resize
		const handleResize = () => {
			if (chartInstance) {
				chartInstance.resize();
			}
		};

		window.addEventListener('resize', handleResize);
	});

	// Cleanup with effect
	$effect(() => {
		return () => {
			window.removeEventListener('resize', () => {
				if (chartInstance) {
					chartInstance.resize();
				}
			});
			chartInstance?.destroy();
		};
	});

	$effect(() => {
		if (chartInstance) {
			chartInstance.data = chartData;
			chartInstance.update('none');
		}
	});

	function formatDate(dateStr: string) {
		if (!dateStr) return '';
		const d = new Date(dateStr);
		return d.toLocaleDateString('en-AU', { day: '2-digit', month: '2-digit', year: 'numeric' });
	}

	// Calculate stats
	const totalIncidents = $derived(incidentStore.list.length);
	const incidentsThisMonth = $derived(
		incidentStore.list.filter((i) => {
			const date = new Date(i.dateReceived);
			const now = new Date();
			return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
		}).length
	);
	const incidentsThisWeek = $derived(
		incidentStore.list.filter((i) => {
			const date = new Date(i.dateReceived);
			const now = new Date();
			const weekAgo = new Date(now.setDate(now.getDate() - 7));
			return date >= weekAgo;
		}).length
	);
</script>

<svelte:head>
	<title>Dashboard | Incident Tracker</title>
</svelte:head>

<div class="flex-1 flex flex-col bg-warm-50 text-warm-900 overflow-hidden">
	<header class="border-b border-warm-200 bg-white/80 px-6 py-5 backdrop-blur flex-shrink-0">
		<div class="mx-auto max-w-[1600px]">
			<h1 class="text-2xl font-bold text-warm-800">Dashboard</h1>
			<p class="mt-1 text-sm text-warm-500">Overview of incident tracking metrics</p>
		</div>
	</header>

	{#if incidentStore.isLoading}
		<div class="flex items-center justify-center py-12">
			<div class="flex flex-col items-center">
				<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-warm-600"></div>
				<p class="mt-3 text-sm text-warm-500">Loading dashboard data...</p>
			</div>
		</div>
	{:else if incidentStore.error}
		<div class="rounded-lg border border-red-200 bg-red-50 p-8 text-center m-6">
			<p class="text-red-600 mb-4">⚠️ {incidentStore.error}</p>
			<button
				onclick={() => incidentStore.reload(data.user?.id)}
				class="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition"
			>
				Try Again
			</button>
		</div>
	{:else}
		<div class="flex-1 overflow-auto">
			<div class="mx-auto max-w-[1600px] px-6 py-6">
				<!-- Stats Cards -->
				<div class="grid grid-cols-3 gap-4 mb-8">
					<div class="rounded-lg border border-warm-200 bg-white p-6 shadow-sm">
						<p class="text-sm font-medium text-warm-600 mb-2">Total Incidents</p>
						<p class="text-3xl font-bold text-accent-600">{totalIncidents}</p>
						<p class="mt-2 text-xs text-warm-500">All records in database</p>
					</div>
					<div class="rounded-lg border border-warm-200 bg-white p-6 shadow-sm">
						<p class="text-sm font-medium text-warm-600 mb-2">This Month</p>
						<p class="text-3xl font-bold text-warm-800">{incidentsThisMonth}</p>
						<p class="mt-2 text-xs text-warm-500">Current calendar month</p>
					</div>
					<div class="rounded-lg border border-warm-200 bg-white p-6 shadow-sm">
						<p class="text-sm font-medium text-warm-600 mb-2">This Week</p>
						<p class="text-3xl font-bold text-warm-700">{incidentsThisWeek}</p>
						<p class="mt-2 text-xs text-warm-500">Last 7 days</p>
					</div>
				</div>

				<!-- Chart -->
				<div class="rounded-lg border border-warm-200 bg-white p-6 shadow-sm">
					<h2 class="mb-4 text-lg font-semibold text-warm-800">Incidents Over Time (Last 30 Days)</h2>
					<div class="w-full h-96" style="position: relative; min-height: 400px;">
						<canvas bind:this={canvasElement} style="max-height: 100%;"></canvas>
					</div>
				</div>

				<!-- Recent Incidents -->
				<div class="mt-8 rounded-lg border border-warm-200 bg-white shadow-sm overflow-hidden">
					<div class="px-6 py-4 border-b border-warm-200 bg-warm-50">
						<h2 class="text-lg font-semibold text-warm-800">Recent Incidents</h2>
					</div>
					{#if incidentStore.list.length === 0}
						<div class="p-8 text-center">
							<p class="text-warm-500">No incidents recorded yet.</p>
						</div>
					{:else}
						<table class="w-full text-left text-sm">
							<thead class="border-b border-warm-200 bg-warm-50">
								<tr>
									<th class="px-6 py-3 font-medium text-warm-600">Date</th>
									<th class="px-6 py-3 font-medium text-warm-600">Type</th>
									<th class="px-6 py-3 font-medium text-warm-600">Ref No.</th>
									<th class="px-6 py-3 font-medium text-warm-600">Driver</th>
									<th class="px-6 py-3 font-medium text-warm-600">Status</th>
								</tr>
							</thead>
							<tbody>
								{#each incidentStore.list.slice(0, 10) as incident (incident.id)}
									<tr class="border-b border-warm-100 last:border-0 hover:bg-warm-50/50">
										<td class="px-6 py-3 whitespace-nowrap text-warm-700">{formatDate(incident.dateReceived)}</td>
										<td class="px-6 py-3 whitespace-nowrap">
											<span class="inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium bg-warm-100 text-warm-700">
												{incident.type}
											</span>
										</td>
										<td class="px-6 py-3 whitespace-nowrap font-mono text-xs text-warm-600">{incident.referenceNo}</td>
										<td class="px-6 py-3 whitespace-nowrap text-warm-600">{incident.driver}</td>
										<td class="px-6 py-3 whitespace-nowrap">
											{#if incident.action === 'Resolved'}
												<span class="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">Resolved</span>
											{:else if incident.action}
												<span class="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">{incident.action}</span>
											{:else}
												<span class="text-warm-300">-</span>
											{/if}
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>
