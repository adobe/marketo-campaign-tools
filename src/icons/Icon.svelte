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
    export let component;
    export let size = "auto";
</script>

<div class:small={size === "small"} class:medium={size === "medium"} class:large={size === "large"} class:auto={size === "auto"}> 
    <svelte:component this={component} />
</div>

<style>
    .large {
        width: 6em;
        height: 6em
    }
    .medium {
        width: 4em;
        height: 4em
    }
    .small {
        width: 2em;
        height: 2em;
    }
    .auto { 
        width: 100%;
    }

    
    /* div:hover {
        fill: rgb(255,0,0);
        transform: scale(1.25);
        transition: transform 0.2s, fill 0.2s;
    } */
</style>

