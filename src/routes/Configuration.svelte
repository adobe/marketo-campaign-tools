<script>
	import Channels from './configurations/Channels.svelte';
    import Dimensions from './configurations/Dimensions.svelte';
    import Upload from './configurations/Upload.svelte';

    let selectedConfiguration = Dimensions;
</script>
<h1>Configuration</h1>
<div class='config-container'>
    <menu>
        <li on:click={() => selectedConfiguration = Channels}>
            Channels
        </li>
        <li on:click={() => selectedConfiguration = Dimensions}>
            Dimensions
        </li>
        <li on:click={() => selectedConfiguration = Upload}>
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
</style>