<script>
    export let name;
    export let label;
    export let placeholder = "Select";
    export let index;
    export let options = [];
    export let value;
</script>

<div  class="cmp-input">
    {#if label}<label for={name}>{label}</label>{/if}
    <select bind:value {name} {placeholder} on:input data-index={index}>
        {#each options as { label, value }}
            <option value={value}>{label}</option>
        {/each}
    </select>
</div>