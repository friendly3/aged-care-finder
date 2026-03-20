<script lang="ts">
	import type { Facility } from '$lib/data/facilities';

	interface Props {
		selected: Facility[];
		onRemove: (id: string) => void;
		onClear: () => void;
	}

	let { selected, onRemove, onClear }: Props = $props();
</script>

{#if selected.length > 0}
	<div class="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-700 bg-gray-900/95 px-6 py-3 backdrop-blur">
		<div class="mx-auto flex max-w-7xl items-center justify-between">
			<div class="flex items-center gap-3">
				<span class="text-sm font-medium text-white">
					Comparing {selected.length} {selected.length === 1 ? 'facility' : 'facilities'}
				</span>
				<div class="flex gap-2">
					{#each selected as facility}
						<span class="flex items-center gap-1 rounded bg-gray-800 px-2 py-1 text-xs text-gray-300">
							{facility.name}
							<button
								onclick={() => onRemove(facility.id)}
								class="ml-1 text-gray-500 hover:text-white"
								aria-label="Remove {facility.name}"
							>
								&times;
							</button>
						</span>
					{/each}
				</div>
			</div>
			<div class="flex gap-2">
				<button
					onclick={onClear}
					class="rounded px-3 py-1.5 text-sm text-gray-400 hover:text-white"
				>
					Clear
				</button>
				{#if selected.length >= 2}
					<a
						href="/compare?ids={selected.map((f) => f.id).join(',')}"
						class="rounded bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-500"
					>
						Compare Now
					</a>
				{:else}
					<span class="rounded bg-gray-700 px-4 py-1.5 text-sm text-gray-500">
						Select at least 2
					</span>
				{/if}
			</div>
		</div>
	</div>
{/if}
