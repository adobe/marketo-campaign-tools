<script>
    import { createEventDispatcher } from 'svelte';

    export let name;
    export let label;
    export let index;
    export let value = new Date();
    export let min;
    export let max;
</script>

<div>
    {#if label}<label for={name}>{label}</label>{/if}
    <input type="date" bind:value name={name} min={min} max={max} data-index={index} on:change>
</div>

<style>
    div { 
        display: flex;
    }
    label {
        flex-grow: 0;
        flex-basis: 40%;
        text-align: left;
    }
    input {
        flex-grow: 1;
        flex-basis: 60%;
    }

    @media (max-width: 640px) {
		div {
			flex-direction: column;
            margin-top: 0.5rem;
		}
        label {
            margin-bottom: 0.25rem;
        }
	}
</style>