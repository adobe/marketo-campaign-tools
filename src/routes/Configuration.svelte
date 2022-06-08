<script>
	import Parameters from './configurations/Parameters.svelte';
    import Dimensions from './configurations/Dimensions.svelte';
    import Upload from './configurations/Upload.svelte';

    let selectedConfiguration = Dimensions;
</script>
<h1>Configuration</h1>
<div class='config-container'>
    <menu>
        <li on:click={() => selectedConfiguration = Parameters} class:selected="{selectedConfiguration == Parameters}">
            Parameters
        </li>
        <li on:click={() => selectedConfiguration = Dimensions} class:selected="{selectedConfiguration == Dimensions}">
            Dimensions
        </li>
        <li on:click={() => selectedConfiguration = Upload} class:selected="{selectedConfiguration == Upload}">
            Upload
        </li>
    </menu>
    <main>
        <svelte:component this={selectedConfiguration} />
    </main>
</div>
<style>
    h1 {
        position: fixed;
        bottom: 1rem;
        left: 1rem;
        margin: 0;
        font-size: 0.8em;
    }

    .config-container {
        display: grid;
        grid-template-columns: minmax(10rem, 1fr) 4fr;
    }

    main {
        margin-left: 1rem;
    }

    menu {
        margin-left: 0;
        padding-left: 0;
        width: 100%;
        height: fit-content;
        border-right: 2px solid lightgray;
    }

    li {
        list-style-type: none;
        height: 100%;
        width: 90%;
        padding: 1rem 0 1rem 10%;
        background-color: lightblue;
    }

    .selected {
        font-weight: bold;
        border: 1px solid grey;
    }
</style>