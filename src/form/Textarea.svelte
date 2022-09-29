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
    import Counter from "./Counter.svelte";

    export let name;
    export let text = "Output";
</script>

<div class="cmp-input">
    <h2>Campaign Name</h2>
    <div>
        <textarea {name} placeholder="Enter data to start creating URL" rows="3" disabled >{text}</textarea>
        <Counter label={"Current count:"} count={text.length} />
    </div>
    
</div>

<style>
    textarea {
        width: 100%;
        max-width: 100%;;
        margin-top: 1em;
        margin-bottom: 0;
    }
</style>
