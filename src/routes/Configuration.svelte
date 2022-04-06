<script>
	import Channels from './configurations/Channels.svelte';
    import Dimensions from './configurations/Dimensions.svelte';

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
    </menu>
    <main>
        <svelte:component this={selectedConfiguration} />
    </main>
</div>
<style>
    .config-container {
        display: grid;
        grid-template-columns: 1fr 4fr;
    }

    menu {
        width: 100%;
        border-right: 2px solid lightgray;
    }

    li {
        list-style-type: none;
        height: 100%;
        width: 100%;
    }
</style>