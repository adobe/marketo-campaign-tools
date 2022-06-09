<script>
    import Counter from "./Counter.svelte";

    export let name;
    export let text = "Output";
</script>

<div class="cmp-input">
    <h2>Campaign Name</h2>
    <div>
        <textarea {name} placeholder="Enter data to start creating URL" rows="3" disabled >{text}</textarea>
        <Counter label={"Current count:"} count={text.length} />
    </div>
    
</div>

<style>
    textarea {
        width: 100%;
        max-width: 100%;;
        margin-top: 1em;
        margin-bottom: 0;
    }
</style>
