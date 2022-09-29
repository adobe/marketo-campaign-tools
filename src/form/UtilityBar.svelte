<!--
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
-->
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