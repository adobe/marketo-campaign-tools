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