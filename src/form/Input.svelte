<script>
    import { createEventDispatcher } from 'svelte';

    export let name;
    export let label;
    export let placeholder = "";
    export let index;
    export let value;
    export let tooltip;
    export let type = "text";
</script>

<div  class="cmp-input">
    {#if label}<label type="text" for={name}>{label}</label>{/if}
    {#if type === "number"}
        <input type="number" bind:value {name} {placeholder} on:input data-index={index} on:change>
    {:else}
        <input type="text" bind:value {name} {placeholder} on:input data-index={index} on:change>
    {/if}
</div>