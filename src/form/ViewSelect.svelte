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
    import { saveFile } from '../lib/utils';
    import UtilityBar from './UtilityBar.svelte';
    import Select from './Select.svelte';

    const dispatch = createEventDispatcher();

    export let selectedPage = "table";
</script>
<UtilityBar urlPage={true}>
    <div class="utility-bar--content">
        <Select 
            label="View" 
            name="url-table-view" 
            on:input={(e) => dispatch("viewChanged", {view: e.target.value})} 
            options={[
                {
                    "label": "Table", 
                    "value": "table"
                },
                {
                    "label": "Detail", 
                    "value": "detail"
                }
            ]}
            value={selectedPage}
        />
        <button class="primary" type="button" on:click={() => dispatch("addNewRow", {})}>Add Row</button>
        <button class="secondary" on:click={() => saveFile("entries")}>Export URL List</button>
    </div>
</UtilityBar>

<style>
    .utility-bar--content {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr;
        column-gap: 1rem;
        padding: 0 2rem;
    }
</style>