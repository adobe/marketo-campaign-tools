<script>
    import { createEventDispatcher } from 'svelte';

    export let name;
    export let label;
    export let placeholder = "";
    export let index;

    let value;
</script>

<div>
    <label for={name}>{label}</label>
    <input type="text" bind:value {name} {placeholder} on:input data-index={index}>
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