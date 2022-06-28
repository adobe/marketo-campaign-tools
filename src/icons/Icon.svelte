<script>
    export let component;
    export let size = "auto";
</script>

<div class:small={size === "small"} class:medium={size === "medium"} class:large={size === "large"} class:auto={size === "auto"}> 
    <svelte:component this={component} />
</div>

<style>
    .large {
        width: 6em;
        height: 6em
    }
    .medium {
        width: 4em;
        height: 4em
    }
    .small {
        width: 2em;
        height: 2em;
    }
    .auto { 
        width: 100%;
    }

    
    /* div:hover {
        fill: rgb(255,0,0);
        transform: scale(1.25);
        transition: transform 0.2s, fill 0.2s;
    } */
</style>

