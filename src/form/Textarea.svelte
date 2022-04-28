<script>
    export let name;
    export let text = "Output";
</script>

<div>
    <h2>Campaign Name</h2>
    <textarea {name} placeholder="Enter data to start creating URL" rows="3" cols="100" disabled >{text}</textarea>
</div>

<style>
    div {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    textarea {
        flex-grow: 1;
        margin-top: 1em;
        margin-bottom: 1em;
    }
    h2 {
        margin-right: 1rem;
    }
</style>
