<script>
    export let label;
    export let count;
    let threshold = 80;
</script>


<div class="notice">
    Max of {threshold} characters. 
    <span class:warning={count >= (threshold - (threshold*0.1)) && count <= threshold} class:exceeded={count > threshold}>
        {label} {count}
    </span>
</div>

<style>

    .warning {
        color: rgb(255, 162, 86);
    }

    .exceeded {
        color: rgb(255, 85, 85);
        font-weight: bold;
    }

    div.notice {
        background-color: rgba(255,255,255,0);
        border: none;
        padding: 0 0.5rem 0.5rem 0.5rem;
        font-style: italic;
        font-size: 0.8rem;
        display: flex;
        justify-content: right;
    }
</style>