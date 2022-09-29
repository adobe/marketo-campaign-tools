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
    import Select from './Select.svelte';

    export let label = "Add New";
    let typeToAdd;
    let options = [
        {
            "label": "Select", 
            "value": "select"
        },
        {
            "label": "Input", 
            "value": "input"
        },
        {
            "label": "Date", 
            "value": "date"
        }
    ];

    const dispatch = createEventDispatcher();
</script>

<div class="add-type">
    <Select 
        label="Type to Add" 
        bind:options
        bind:value={typeToAdd}
    />
    <button class="btn-add" on:click={() => dispatch('newItemAdded', {type: typeToAdd})}>{label}</button>
</div>

<style>
    .add-type {
        display: grid;
        grid-template-columns: 2fr 1fr;
    }

    .btn-add {
        background-color: slategray;
        color: white;
        border-radius: 4px;
    }
</style>