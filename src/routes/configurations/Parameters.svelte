<script>
    import Input from '../../form/Input.svelte';
    import Select from '../../form/Select.svelte';
    import Options from '../../form/Options.svelte';
    import UtilityBar from '../../form/UtilityBar.svelte';
    import { 
        removeOption, 
        addNewOption, 
        handleOptsKeyUpdate, 
        handleOptsValueUpdate, 
        sortObject, 
        addNewInput,
        findNextAvailableIndex } from '../../lib/utils';

    let config;
    let inputs;

    const init = async() => {
        config = await window.eapi.getConfig();
        inputs = config.UrlBuilder.inputs;
    }

    let initalization = init();
 
    let updateDebounce;

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

    const sortEntries = (() => config.UrlBuilder.inputs = sortObject(config.UrlBuilder.inputs))

    // May convert to utility function
    const debounceWrapper = function(timer, cb, time) {
        clearTimeout(timer);
        cb();
        updateDebounce = setTimeout(() => {

            inputs = config.UrlBuilder.inputs;
            window.eapi.updateConfig(config)
                .then(updated => { 
                    console.log(`Configuration was updated: ${updated}`)
                });
        }, time)   
    }

    const debounceAndUpdate = (fn, time = 500) => {
        debounceWrapper(updateDebounce, fn, time);
    }

</script>

<main>
    {#await initalization}
        <div>Loading...</div>
    {:then}
        {#each Object.keys(config.UrlBuilder.inputs) as key}
            <fieldset>
                <Input 
                    label="name"
                    name="{key}" 
                    placeholder="{key}" 
                    on:change={(e) => { debounceAndUpdate(() => handleInputUpdate(e, key, inputs[key]))}}
                    value={key}
                />
                {#each Object.keys(inputs[key]) as subkey}
                    {#if subkey === "options"}
                        <Options 
                            label={"Options"}
                            key="{key}"
                            inputs="{inputs}"
                            on:OptionKeyUpdated={(e) => debounceAndUpdate(() => handleOptsKeyUpdate(config.UrlBuilder.inputs, inputs, e.detail))}
                            on:OptionValueUpdated={(e) => debounceAndUpdate(() => handleOptsValueUpdate(config.UrlBuilder.inputs, inputs, e.detail))}
                            on:OptionAdded={(e) => debounceAndUpdate(() => addNewOption(config.UrlBuilder.inputs, inputs, e.detail.key), 100)}
                            on:OptionRemoved={(e) => debounceAndUpdate(() => removeOption(config.UrlBuilder.inputs, inputs, e.detail.key, e.detail.index), 100)}
                        />
                    {:else if subkey === "subs"}
                        <!-- TODO: Commenting out the below until review of no-substitution functionality is performed-->
                        <!-- Substitutions: 
                        <div class="info">
                            Substitutions are utilized with text inputs. They will convert the original text (left) with the substution text (right) when used in a campaign name or URL.
                        </div>
                        <div class="options-listing__header">
                            <div>Original</div>
                            <div>Substitution</div>
                            <div></div>
                        </div>
                        {#each Object.entries(inputs[key].subs) as sub}
                            <div class="option-listing">
                                <input value={sub[0]} on:change={(e) => debounceAndUpdate(() => handleSubsKeyUpdate(e, key, inputs[key], sub[0]))} />
                                <input value={sub[1]} on:input={(e) => debounceAndUpdate(() => handleSubsValueUpdate(e, key, inputs[key], sub[0]))} />
                                <button class="btn-remove__sub" on:click={(e) => debounceAndUpdate(() => removeSub(key, sub[0]))}>-</button>
                            </div>
                        {/each}
                        <button class="btn-add" on:click={(e) => { addNewSub(key) }}>Add Substitution</button> -->
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
        <UtilityBar 
            configPage={true}
            on:sortItems={(e) => debounceAndUpdate(() => sortEntries())}
            on:newItemAdded={(e) => inputs["newParamater"] = addNewInput(e.detail.type, false, findNextAvailableIndex(inputs))}>
        </UtilityBar>
    {/await}
</main>

<style>
    .btn-remove {
        width: 25%;
        background-color: red;
        border-radius: 4px;
        float:right;
        color: #fff;
        margin-top: 1rem;
    }
</style>