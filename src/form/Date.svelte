<script>
    import { createEventDispatcher } from 'svelte';

    export let name;
    export let label;
    export let index;
    export let value = new Date();
    export let min;
    export let max;
</script>

<div class="cmp-input">
    {#if label}<label for={name}>{label}</label>{/if}
    <input type="date" bind:value name={name} min={min} max={max} data-index={index} on:change>
</div>