<script>
    export let name;
    export let label;
    export let index;
    export let value = new Date();
    export let min;
    export let max;
    export let tooltip;
</script>

<div class="cmp-input">
    {#if label}<label title={tooltip} for={name}>{label}</label>{/if}
    <input title={tooltip} type="date" bind:value name={name} min={min} max={max} data-index={index} on:change>
</div>