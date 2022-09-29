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
    export let label;
    export let count;
    let threshold = 80;
</script>


<div class="notice">
    Max of {threshold} characters. 
    <span class:warning={count >= (threshold - (threshold*0.1)) && count <= threshold} class:exceeded={count > threshold}>
        {label} {count}
    </span>
</div>

<style>

    .warning {
        color: rgb(255, 162, 86);
    }

    .exceeded {
        color: rgb(255, 85, 85);
        font-weight: bold;
    }

    div.notice {
        background-color: rgba(255,255,255,0);
        border: none;
        padding: 0 0.5rem 0.5rem 0.5rem;
        font-style: italic;
        font-size: 0.8rem;
        display: flex;
        justify-content: right;
    }
</style>