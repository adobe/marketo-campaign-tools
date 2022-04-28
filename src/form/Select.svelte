<script>
    export let name;
    export let label;
    export let placeholder = "Select";
    export let index;
    export let options = [];
    export let value;
</script>

<div>
    <label for={name}>{label}</label>
    <select bind:value {name} {placeholder} on:input data-index={index}>
        {#each options as { label, value }}
            <option value={value}>{label}</option>
        {/each}
    </select>
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