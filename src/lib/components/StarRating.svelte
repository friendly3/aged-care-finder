<script lang="ts">
	interface Props {
		rating: number;
		size?: 'sm' | 'md' | 'lg';
	}

	let { rating, size = 'md' }: Props = $props();

	const sizeClass = { sm: 'text-sm', md: 'text-lg', lg: 'text-2xl' };
</script>

<div class="flex items-center gap-0.5" aria-label="{rating} out of 5 stars">
	{#each Array(5) as _, i}
		<span class={sizeClass[size]} class:text-yellow-400={i < rating} class:text-gray-600={i >= rating}>
			&#9733;
		</span>
	{/each}
</div>
