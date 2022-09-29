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
    import Input from '../../form/Input.svelte';
    import Select from '../../form/Select.svelte';

    let config;

    const init = async() => {
        config = await window.eapi.getConfig();
    }

    let initalization = init();
 
    let updateDebounce;
    
    // ----- Add / Remove Parameter Handling -----
    const handleFieldUpdate = ((e) => {
        console.log(`updating ${e.target.value}`);
        return;
    })

    // May convert to utility function
    const debounceWrapper = function(timer, cb, time) {
        clearTimeout(timer);
        cb();
        updateDebounce = setTimeout(() => {
            // TODO: Figure out redraw while updating index
            window.eapi.updateConfig(config)
                .then(updated => { 
                    console.log(`Configuration was updated: ${updated}`)
                });
        }, time)   
    }

    const debounceAndUpdate = (fn) => {
        debounceWrapper(updateDebounce, fn, 500);
    }

</script>

<main>
    {#await initalization}
        <div>Loading...</div>
    {:then}
        <Input 
            label="Delimiter"
            name="delimiter"
            type="input" 
            on:input={(e) => debounceAndUpdate(() => handleFieldUpdate(e))} 
            bind:value={config.Delimiter}
        />
        <Input 
            label="Regex Pattern"
            name="regexReplacePattern"
            type="input" 
            on:input={(e) => debounceAndUpdate(() => handleFieldUpdate(e))} 
            bind:value={config.ReplacePattern.pattern}
        />
        <Input 
            label="Replacement Character"
            name="replaceCharacter"
            type="input" 
            on:input={(e) => debounceAndUpdate(() => handleFieldUpdate(e))} 
            bind:value={config.ReplacePattern.symbol}
        />
        <Input 
            label="URL Prefix"
            name="urlPrefix"
            type="input" 
            on:input={(e) => debounceAndUpdate(() => handleFieldUpdate(e))} 
            bind:value={config.UrlBuilder.prefix}
        />
    {/await}
</main>