<script>
    import { createEventDispatcher } from 'svelte';

    export let label = "Options";
    export let inputs;
    export let key;
    export let tooltip;

    const dispatch = createEventDispatcher();
</script>

<div  class="cmp-input">
    {#if label}
        <label title={tooltip} type="text" for={key}>
            {label}
        </label>
    {/if}
    <div class="options-listing">
        <div class="options-listing__header">
            <div>Value Choice</div>
            <div>Value Appearance</div>
            <div><!-- spacer --></div>
        </div>
        <div class="option-listing">
            {#each inputs[key].options as option, i}
                <input value={option.label} on:input={(e) =>  dispatch("OptionKeyUpdated", { value: e.target.value, key: key, input: inputs[key], index: i})}/>
                <input value={option.value} on:input={(e) => dispatch("OptionValueUpdated", { value: e.target.value, key: key, input: inputs[key], index: i})}/>
                <button class="btn-remove__option" on:click={(e) => dispatch("OptionRemoved", {key : key, index: i})}>Remove</button>
            {/each}
        </div>
        <button class="btn-add" on:click={() => { dispatch("OptionAdded", {key: key})}}>Add Option</button>
    </div>
</div>

<style>
    .btn-add {
        width: 25%;
        background-color: slategray;
        color: white;
        border-radius: 4px;
        margin: 1rem;
    }

    .option-listing, .options-listing__header {
        display: grid;
        grid-template-columns: 3fr 3fr 1fr;
        column-gap: 1rem;
    }

    .options-listing__header {
        margin: 1rem 0;
        line-height: 2rem;
        padding-left: 0.5rem;
        font-weight: bold;
        border-bottom: 1px solid slategray;
        color: slategray;
    }
</style>
                        