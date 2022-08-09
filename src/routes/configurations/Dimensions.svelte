<script>
import Input from '../../form/Input.svelte';
import Select from '../../form/Select.svelte';
import UtilityBar from '../../form/UtilityBar.svelte';
import Options from '../../form/Options.svelte';
import { 
    removeOption, 
    addNewOption, 
    handleOptsKeyUpdate, 
    handleOptsValueUpdate, 
    sortObject, 
    addNewInput,
    findNextAvailableIndex } from '../../lib/utils';

let config = {};
let inputs = {};

// TODO: Set this handling across application
sessionStorage.setItem("lastPage", "Dimensions");

const init = async() => {
    config = await window.eapi.getConfig();
    inputs = config.CampaignDetails.Inputs;
}

let initalization = init();

const handleInputUpdate = ((e, key, input) => {
    delete config.CampaignDetails.Inputs[key]            
    config.CampaignDetails.Inputs[e.target.value] = input;
    inputs = config.CampaignDetails.Inputs;
})

const handleFieldUpdate = ((e, key, field) => {
    config.CampaignDetails.Inputs[key][field] = e.target.value;
    inputs = config.CampaignDetails.Inputs;
})
 
// ----- Type Changes Handling -----

const handleTypeChange = ((e, key) => {
    let input = inputs[key];
    let choosenType = e.target.value;
    switch (choosenType) {
        case "input": {
            delete input.options;
            input.subs = {};
            break;
        }
        case "select": {
            delete input.subs;
            input.options = [{
                "label": "",
                "value": ""
            }]
            break;
        }
        case "date": {
            delete input.options;
            delete input.subs;
            break;
        }
    }
    input.type = choosenType;
    inputs[key] = input;
    config.CampaignDetails.Inputs = inputs;
})

const removeInput = ((key) => {
    delete inputs[key];
    config.CampaignDetails.Inputs = inputs;
    window.eapi.updateConfig(config)
			.then(updated => console.log(`Configuration was updated: ${updated}`));
})

let updateDebounce;

// May convert to utility function
const debounceWrapper = function(timer, cb, time) {
    clearTimeout(timer);
    cb();
    updateDebounce = setTimeout(() => {

        inputs = config.CampaignDetails.Inputs;
        window.eapi.updateConfig(config)
			.then(updated => { 
                console.log(`Configuration was updated: ${updated}`)
            });
    }, time)   
}

// Using to simplify handler logic
const debounceAndUpdate = (handler, time = 500) => {
    debounceWrapper(updateDebounce, handler, time);
}

const sortItems = (() => { config.CampaignDetails.Inputs = sortObject(config.CampaignDetails.Inputs); });

</script>
<main>
    {#await initalization}
        <div>Loading...</div>
    {:then}
        {#each Object.keys(config.CampaignDetails.Inputs) as key}
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
                            on:OptionKeyUpdated={(e) => debounceAndUpdate(() => handleOptsKeyUpdate(config.CampaignDetails.Inputs, inputs, e.detail))}
                            on:OptionValueUpdated={(e) => debounceAndUpdate(() => handleOptsValueUpdate(config.CampaignDetails.Inputs, inputs, e.detail))}
                            on:OptionAdded={(e) => debounceAndUpdate(() => addNewOption(config.CampaignDetails.Inputs, inputs, e.detail.key), 100)}
                            on:OptionRemoved={(e) => debounceAndUpdate(() => removeOption(config.CampaignDetails.Inputs, inputs, e.detail.key, e.detail.index), 100)}
                        />
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
                    {:else if subkey === "value"}
                        <!-- Value is: ${inputs[key][subkey]} -->
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
            on:newItemAdded={(e) => inputs["newDimension"] = addNewInput(e.detail.type, true, findNextAvailableIndex(inputs))}
            on:sortItems={() => debounceAndUpdate(() => sortItems())}>
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