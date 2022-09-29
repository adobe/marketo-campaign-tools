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
    export let name;
    export let label;
    export let placeholder = "Select";
    export let index;
    export let options = [];
    export let value;
    export let tooltip;
</script>

<div  class="cmp-input">
    {#if label}<label title={tooltip} for={name}>{label}</label>{/if}
    <select title={tooltip} bind:value {name} {placeholder} on:input data-index={index}>
        {#each options as { label, value }}
            <option value={value}>{label}</option>
        {/each}
    </select>
</div>