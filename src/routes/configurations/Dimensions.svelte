<script>
import Input from "../../form/Input.svelte";
import Select from "../../form/Select.svelte";
import AddInput from "../../form/AddInput.svelte";

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

// ----- Substitution Handling ----- 
const handleSubsKeyUpdate = ((e, key, input, sub) => {
    input.subs[e.target.value] = input.subs[sub];
    delete input.subs[sub];
    inputs[key] = input;
    config.CampaignDetails.Inputs = inputs;
})

const handleSubsValueUpdate = ((e, key, input, sub) => {
    input.subs[sub] = e.target.value;
    inputs[key] = input;
    config.CampaignDetails.Inputs = inputs;
})

const addNewSub = ((key) => {
    let input = inputs[key];
    input.subs["newSub"] = "";
    inputs[key] = input;
    config.CampaignDetails.Inputs = inputs;
});

const removeSub = ((k, s) => {
    let input = inputs[k];
    delete input.subs[s];
    inputs[k] = input;
    config.CampaignDetails.Inputs = inputs;
})

// ----- Options Handling -----

const handleOptsKeyUpdate = ((e, key, input, i) => {
    let val = e.target.value;
    input.options[i].label = val;
    inputs[key] = input;
    config.CampaignDetails.Inputs = inputs;
})

const handleOptsValueUpdate = ((e, key, input, index) => {
    input.options[index].value = e.target.value;
    inputs[key] = input;
    config.CampaignDetails.Inputs = inputs;
 })

 const addNewOption = ((key) => {
    let input = inputs[key];
    input.options[input.options.length++] = {
        "label": "new option", 
        "value": ""
    }
    inputs[key] = input;
    config.CampaignDetails.Inputs = inputs; 
})
    
const removeOption = ((k, i) => {
    inputs[k].options.splice(i, 1);
    config.CampaignDetails.Inputs = inputs;
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

const addNewInput = ((typeToAdd) => {
     let input =  {
        "label": "",
        "placeholder": "",
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
})


let updateDebounce;

// May convert to utility function
const debounceWrapper = function(timer, cb, time) {
    clearTimeout(timer);
    cb();
    updateDebounce = setTimeout(() => {
        window.eapi.sortConfig(config);

        // TODO: Figure out redraw while updating index
        inputs = config.CampaignDetails.Inputs;
        window.eapi.updateConfig(config)
			.then(updated => { 
                console.log(`Configuration was updated: ${updated}`)
            });
    }, time)   
}

// Using to simplify handler logic
const debounceAndUpdate = (handler) => {
    debounceWrapper(updateDebounce, handler, 500);
}

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
                        Options: 
                        <div class="options-listing__header">
                            <div>Label</div>
                            <div>Value</div>
                            <div><!-- spacer --></div>
                        </div>
                        <div class="option-listing">
                            {#each inputs[key].options as option, i}
                                <input value={option.label} on:input={(e) =>  debounceAndUpdate(() => handleOptsKeyUpdate(e, key, inputs[key], i))}/>
                                <input value={option.value} on:input={(e) => debounceAndUpdate(() => handleOptsValueUpdate(e, key, inputs[key], i))}/>
                                <button class="btn-remove__option" on:click={(e) => debounceAndUpdate(() => removeOption(key, i))}>Remove</button>
                            {/each}
                        </div>
                        <button class="btn-add" on:click={(e) => { addNewOption(key) }}>Add Option</button>
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
                        Substitutions: 
                        <div class="info">
                            Substitutions are utilized with text inputs. They will convert the original text (left) with the substution text (right) when used in a campaign name or URL.
                        </div>
                        <div class="options-listing__header">
                            <div>Original</div>
                            <div>Substitution</div>
                            <div><!-- spacer --></div>
                        </div>
                        {#each Object.entries(inputs[key].subs) as sub}
                            <div class="option-listing">
                                <input value={sub[0]} on:change={(e) => debounceAndUpdate(() => handleSubsKeyUpdate(e, key, inputs[key], sub[0]))} />
                                <input value={sub[1]} on:input={(e) => debounceAndUpdate(() => handleSubsValueUpdate(e, key, inputs[key], sub[0]))} />
                                <button class="btn-remove__sub" on:click={(e) => debounceAndUpdate(() => removeSub(key, sub[0]))}>-</button>
                            </div>
                        {/each}
                        <button class="btn-add" on:click={(e) => { addNewSub(key) }}>Add Substitution</button>
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
        <AddInput on:newItemAdded={(e) => addNewInput(e.detail.type)} />
    {/await}
</main>

<style>
    .btn-remove {
        width: 25%;
        background-color: red;
        border-radius: 4px;
        float:right;
        color: #fff;
    }

    .btn-add {
        width: 25%;
        background-color: slategray;
        color: white;
        border-radius: 4px;
    }

    .option-listing, .options-listing__header {
        display: grid;
        grid-template-columns: 3fr 3fr 1fr;
        column-gap: 1rem;
    }
</style>