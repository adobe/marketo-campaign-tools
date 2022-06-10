<script>
    export let name;
    export let label;
    export let placeholder = "";
    export let index;
    export let value;
    export let tooltip;
    export let type = "text";
</script>

<div  class="cmp-input">
    {#if label}
        <label title={tooltip} type="text" for={name}>
            {label}
        </label>{/if}
    {#if type === "number"}
        <input type="number" title={tooltip} bind:value {name} {placeholder} on:input data-index={index} on:change>
    {:else}
        <input type="text" title={tooltip} bind:value {name} {placeholder} on:input data-index={index} on:change>
    {/if}
</div>