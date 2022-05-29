<script>
import Input from "../../form/Input.svelte";
import Select from "../../form/Select.svelte";

let config = {};
let inputs = {};
let typeToAdd = "Select";

// TODO: Set this handling across application
sessionStorage.setItem("lastPage", "Dimensions");

const init = async() => {
    config = await window.eapi.getConfig();
    inputs = config.CampaignDetails.Inputs;
}

let initalization = init();

let updateDebounce;

const handleInputUpdate = ((e, key, input) => {
    delete config.CampaignDetails.Inputs[key]            
    config.CampaignDetails.Inputs[e.target.value] = input;
    inputs = config.CampaignDetails.Inputs;
})

const handleFieldUpdate = ((e, key, field) => {
    config.CampaignDetails.Inputs[key][field] = e.target.value;
    inputs = config.CampaignDetails.Inputs;
})

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

const addNewInput = (() => {
    inputs["newDimension"] = 
        {
            "label": "",
            "placeholder": "",
            "index": 0,
            "type": "select",
            "tooltip": "",
            "subs": {
                "Item 1A": "I1A",
                "Item 1B": "I1B",
                "Item 1C": "I1C"
            } 
        }
})

const removeOption = ((k, i) => {
    inputs[k].options.splice(i, 1);
    config.CampaignDetails.Inputs = inputs;
})

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
<h1>Dimensions</h1>
{#await initalization}
    <div>Loading...</div>
{:then}
    {#each Object.keys(config.CampaignDetails.Inputs) as key}
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
                    Value is: ${inputs[key][subkey]}
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
    <button class="btn-add" on:click={() => addNewInput()}>Add New Dimension</button>
{/await}

<style>
.btn-remove {
    width: 100%;
    background-color: red;
}

.btn-add {
    width: 100%;
    background-color: lightgray;
    color: slategray;
}

.option-listing {
    display: grid;
    grid-template-columns: 3fr 3fr 1fr;
}
</style>