<script>
    import Input from '../../form/Input.svelte';
    import Select from '../../form/Select.svelte';

    let config;
    let typeToAdd = "select";
    let inputs;

    const init = async() => {
        config = await window.eapi.getConfig();
        inputs = config.UrlBuilder.inputs;
    }

    let initalization = init();
 
    let updateDebounce;

    /**
    * Update types / values
    */ 

    /**
    * Update options
    */ 

    // ----- Options Handling -----

    const handleOptsKeyUpdate = ((e, key, input, i) => {
        let val = e.target.value;
        input.options[i].label = val;
        inputs[key] = input;
        config.UrlBuilder.inputs = inputs;
    })

    const handleOptsValueUpdate = ((e, key, input, index) => {
        input.options[index].value = e.target.value;
        inputs[key] = input;
        config.UrlBuilder.inputs = inputs;
    })

    const addNewOption = ((key) => {
        let input = inputs[key];
        input.options[input.options.length++] = {
            "label": "new option", 
            "value": ""
        }
        inputs[key] = input;
        config.UrlBuilder.inputs = inputs; 
    })

    const removeOption = ((k, i) => {
        inputs[k].options.splice(i, 1);
        config.UrlBuilder.inputs = inputs;
    })

    // ----- Type Changes Handling -----

    const handleTypeChange = ((e, key) => {
        let input = inputs[key];
        let choosenType = e.target.value;
        switch (choosenType) {
            case "input": {
                delete input.options;
                break;
            }
            case "select": {
                input.options = [{
                    "label": "",
                    "value": ""
                }]
                break;
            }
            case "date": {
                delete input.options;
                break;
            }
        }
        input.type = choosenType;
        inputs[key] = input;
        config.UrlBuilder.inputs = inputs;
    })
    
    // ----- Add / Remove Parameter Handling -----
    const addNewParameter = () => {
        let input =  {
            "label": "",
            "index": 0,
            "tooltip": "" 
        }

        switch (typeToAdd) {
            case "input": 
                input.subs = {"sub1":"val1"}
                input.type = "input";
                break;
            case "select": 
                input.options = [{
                    "label": "Option 1", 
                    "value": "Value 1"
                }]
                input.type = "select";
                break;
            case "date": 
                input.type = "date";
                break;
        }
        
        inputs["newDimension"] = input; 
    }

    const removeInput = (key) => {
        delete inputs[key];
        config.UrlBuilder.inputs = inputs;
        window.eapi.updateConfig(config)
			.then(updated => console.log(`Configuration was updated: ${updated}`));
    }

    const handleInputUpdate = ((e, key, input) => {
        delete config.UrlBuilder.inputs[key]            
        config.UrlBuilder.inputs[e.target.value] = input;
        inputs = config.UrlBuilder.inputs;
    })

    const handleFieldUpdate = ((e, key, field) => {
        config.UrlBuilder.inputs[key][field] = e.target.value;
        inputs = config.UrlBuilder.inputs;
    })

    // ----- Substitution Handling ----- 
    const handleSubsKeyUpdate = ((e, key, input, sub) => {
        input.subs[e.target.value] = input.subs[sub];
        delete input.subs[sub];
        inputs[key] = input;
        config.UrlBuilder.inputs = inputs;
    })

    const handleSubsValueUpdate = ((e, key, input, sub) => {
        input.subs[sub] = e.target.value;
        inputs[key] = input;
        config.UrlBuilder.inputs = inputs;
    })

    const addNewSub = ((key) => {
        let input = inputs[key];
        input.subs["newSub"] = "";
        inputs[key] = input;
        config.UrlBuilder.inputs = inputs;
    });

    const removeSub = ((k, s) => {
        let input = inputs[k];
        delete input.subs[s];
        inputs[k] = input;
        config.UrlBuilder.inputs = inputs;
    })

    // May convert to utility function
    const debounceWrapper = function(timer, cb, time) {
        clearTimeout(timer);
        cb();
        updateDebounce = setTimeout(() => {
            window.eapi.sortConfig(config);

            // TODO: Figure out redraw while updating index
            inputs = config.UrlBuilder.inputs;
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
        {#each Object.keys(config.UrlBuilder.inputs) as key}
            <fieldset>
                <Input 
                    label="key"
                    name="{key}" 
                    placeholder="{key}" 
                    on:change={(e) => { debounceAndUpdate(() => handleInputUpdate(e, key, inputs[key]))}}
                    value={key}
                />
                {#each Object.keys(inputs[key]) as subkey}
                    {#if subkey === "options"}
                        Options: 
                        <div class="option-listing">
                            {#each inputs[key].options as option, i}
                                <input value={option.label} on:input={(e) =>  debounceAndUpdate(() => handleOptsKeyUpdate(e, key, inputs[key], i))}/>
                                <input value={option.value} on:input={(e) => debounceAndUpdate(() => handleOptsValueUpdate(e, key, inputs[key], i))}/>
                                <button class="btn-remove__option" on:click={(e) => debounceAndUpdate(() => removeOption(key, i))}>-</button>
                            {/each}
                        </div>
                        <button class="btn-add" on:click={(e) => { addNewOption(key) }}>Add Option</button>
                    {:else if subkey === "subs"}
                        Substitutions: 
                        {#each Object.entries(inputs[key].subs) as sub}
                            <div class="option-listing">
                                <input value={sub[0]} on:change={(e) => debounceAndUpdate(() => handleSubsKeyUpdate(e, key, inputs[key], sub[0]))} />
                                <input value={sub[1]} on:input={(e) => debounceAndUpdate(() => handleSubsValueUpdate(e, key, inputs[key], sub[0]))} />
                                <button class="btn-remove__sub" on:click={(e) => debounceAndUpdate(() => removeSub(key, sub[0]))}>-</button>
                            </div>
                        {/each}
                        <button class="btn-add" on:click={(e) => { addNewSub(key) }}>Add Substitution</button>
                    {:else if subkey === "value"}
                        <!-- Value is: ${inputs[key][subkey]} -->
                    {:else if subkey === "type"}
                            <Select 
                                label="{subkey}" 
                                name="{key}-{subkey}" 
                                on:input={(e) => debounceAndUpdate(() => handleTypeChange(e, key))} 
                                options={[
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
                                ]}
                                value={inputs[key][subkey]}
                            />
                    {:else}
                        <Input 
                            label="{subkey}"
                            name="{key}-{subkey}"
                            type={subkey === "index" ? "number" : "text"} 
                            on:input={(e) => debounceAndUpdate(() => handleFieldUpdate(e, key, subkey))} 
                            value={inputs[key][subkey]}
                        />
                    {/if}
                {/each}
                <button class="btn-remove" on:click={() => removeInput(key)}>Remove</button>
            </fieldset>
        {/each}
        <Select 
            label="Type to Add" 
            options={[
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
            ]}
            bind:value={typeToAdd}
        />
        <button class="btn-add" on:click={() => addNewParameter()}>Add New Parameter</button>
    {/await}
</main>