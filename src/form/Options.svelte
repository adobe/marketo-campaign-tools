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

    export let label = "Options";
    export let inputs;
    export let key;
    export let tooltip;

    const dispatch = createEventDispatcher();
</script>

<div  class="cmp-input">
    {#if label}
        <label title={tooltip} type="text" for={key}>
            {label}
        </label>
    {/if}
    <div class="options-listing">
        <div class="options-listing__header">
            <div>Value Choice</div>
            <div>Value Appearance</div>
            <div><!-- spacer --></div>
        </div>
        <div class="option-listing">
            {#each inputs[key].options as option, i}
                <input value={option.label} on:input={(e) =>  dispatch("OptionKeyUpdated", { value: e.target.value, key: key, input: inputs[key], index: i})}/>
                <input value={option.value} on:input={(e) => dispatch("OptionValueUpdated", { value: e.target.value, key: key, input: inputs[key], index: i})}/>
                <button class="btn-remove__option" on:click={(e) => dispatch("OptionRemoved", {key : key, index: i})}>Remove</button>
            {/each}
        </div>
        <button class="btn-add" on:click={() => { dispatch("OptionAdded", {key: key})}}>Add Option</button>
    </div>
</div>

<style>
    .btn-add {
        width: 25%;
        background-color: slategray;
        color: white;
        border-radius: 4px;
        margin: 1rem;
    }

    .option-listing, .options-listing__header {
        display: grid;
        grid-template-columns: 3fr 3fr 1fr;
        column-gap: 1rem;
    }

    .options-listing__header {
        margin: 1rem 0;
        line-height: 2rem;
        padding-left: 0.5rem;
        font-weight: bold;
        border-bottom: 1px solid slategray;
        color: slategray;
    }
</style>
                        