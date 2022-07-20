<script>
    import { createEventDispatcher } from 'svelte';
    import AddInput from './AddInput.svelte';

    const dispatch = createEventDispatcher();

    export let configPage = false;
    export let urlPage = false;
</script>

<div class="utility-bar" class:configPage class:urlPage>
    <div class="buttons__utility">
        {#if configPage}
            <button on:click={(e) => dispatch('sortItems', {})}>Sort</button>
        {/if}
        <!-- Page-specific buttons can be slotted here -->
        <slot></slot>
    </div>
    {#if configPage}
        <AddInput on:newItemAdded />
    {/if}
</div>

<style>
    .utility-bar {
        width: 80%;
        display: grid;
        background-color: #f5f5f5;
        border-top: 0.5px solid #ccc;
        position: fixed;
        bottom: 0;
        height: 3rem;
        align-items: center;
        padding: 0 2rem;
    }

    .configPage {
        grid-template-columns: 1fr 5fr;
    }

    .urlPage {
        grid-template-columns: 1fr;
    }

    .buttons__utility {
        border-right: 2px solid slategray;
    }

    :global(.utility-bar input,button,select) {
        margin: 0;
    }
</style>