<script>
    export let label;
    export let count;
    let threshold = 80;
</script>

<div class:warning={count >= (threshold - (threshold*0.1)) && count <= threshold} class:exceeded={count > threshold}>
    {label} {count}
</div>
<div class="notice">
    Max of {threshold} characters
</div>

<style>
    div {
        padding: 2rem;
        background-color: #ddd;
        border: 1px solid #999;
    }

    .warning {
        background-color: #ff5;
    }

    .exceeded {
        background-color: #f55;
    }

    div.notice {
        background-color: rgba(255,255,255,0);
        border: none;
        padding: 0.5rem;
        font-style: italic;
        font-size: 0.8rem;
    }
</style>