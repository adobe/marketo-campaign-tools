<script>
    import { createEventDispatcher } from 'svelte';
    import Select from './Select.svelte';

    export let label = "Add New";
    let typeToAdd;
    let options = [
        {
            "label": "Select", 
            "value": "select"
        },
        {
            "label": "Input", 
            "value": "input"
        },
        {
            "label": "Date", 
            "value": "date"
        }
    ];

    const dispatch = createEventDispatcher();
</script>

<div class="add-type">
    <Select 
        label="Type to Add" 
        bind:options
        bind:value={typeToAdd}
    />
    <button class="btn-add" on:click={() => dispatch('newItemAdded', {type: typeToAdd})}>{label}</button>
</div>

<style>
    .add-type {
        display: grid;
        grid-template-columns: 2fr 1fr;
    }
</style>