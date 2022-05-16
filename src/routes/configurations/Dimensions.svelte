<script>
import Input from "../../form/Input.svelte";
import Select from "../../form/Select.svelte";


let config = {};
let inputs = {};

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
    let previousVal = input.subs[sub];
    delete input.subs[sub];
    input.subs[e.target.value] = previousVal;
    inputs[key] = input;
    config.CampaignDetails.Inputs = inputs;
})

const handleSubsValueUpdate = ((e, key, input, sub) => {
    input.subs[sub] = e.target.value;
    inputs[key] = input;
    config.CampaignDetails.Inputs = inputs;
})

const handleOptsKeyUpdate = ((e, key, input, i) => {
    input.options[i].label = e.target.value;
    inputs[key] = input;
    config.CampaignDetails.Inputs = inputs;
})

const handleOptsValueUpdate = ((e, key, input, index) => {
    input.options[index].value = e.target.value;
    inputs[key] = input;
    config.CampaignDetails.Inputs = inputs;
 })

// May convert to utility function
const debounceWrapper = function(timer, cb, time) {
    clearTimeout(timer);
    cb();
    updateDebounce = setTimeout(() => {
        window.eapi.updateConfig(config)
			.then(updated => console.log(`Configuration was updated: ${updated}`));
    }, time)   
}

const handleTypeChange = (() => {

})

// Using to simplify handler logic
const debounceAndUpdate = (handler) => {
    debounceWrapper(updateDebounce, handler, 500);
}

</script>
<h1>Dimensions</h1>
{#await initalization}
    <div>Loading...</div>
{:then}
    <div>Loaded</div>
    {#each Object.keys(config.CampaignDetails.Inputs) as key}
        <fieldset>
            <!-- 
                "dataPointA": {
                    "label": "Data Point A",
                    "placeholder": "Data Point A",
                    "index": 2,
                    "type": "input",
                    "subs": {
                        "Item 1A": "I1A",
                        "Item 1B": "I1B",
                        "Item 1C": "I1C"
                    },
                    "value": "Item 1D"
                },
            -->
            <Input 
                label="Key"
                name="{key}" 
                placeholder="{key}" 
                on:input={(e) => debounceAndUpdate(() => handleInputUpdate(e, key, inputs[key]))} 
                value={key}
            />
            {#each Object.keys(inputs[key]) as subkey}
                {#if subkey === "options"}
                    Options: 
                    {#each inputs[key].options as option, i}
                        <div>
                            <input name={`${option.value}-label`} value={option.label} on:input={(e) =>  debounceAndUpdate(() => handleOptsKeyUpdate(e, key, inputs[key], i))}/>
                            <input name={`${option.value}-value`} value={option.value} on:input={(e) => debounceAndUpdate(() => handleOptsValueUpdate(e, key, inputs[key], i))}/>
                        </div>
                    {/each}
                {:else if subkey === "type"}
                        <Select 
                            label="{subkey}" 
                            name="{key}-{subkey}" 
                            on:input={(e) => handleTypeChange(e, inputs[key])} 
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
                    Substituations: 
                    {#each Object.entries(inputs[key].subs) as sub}
                        <div>
                            <input name={`${sub[0]}-label`} value={sub[0]} on:input={(e) => debounceAndUpdate(() => handleSubsKeyUpdate(e, key, inputs[key], sub[0]))} />
                            <input name={`${sub[0]}-value`} value={sub[1]} on:input={(e) => debounceAndUpdate(() => handleSubsValueUpdate(e, key, inputs[key], sub[0]))} />
                        </div>
                    {/each}
                {:else}
                    <Input 
                        label="{subkey}"
                        name="{key}-{subkey}" 
                        on:input={(e) => debounceAndUpdate(() => handleFieldUpdate(e, key, subkey))} 
                        value={inputs[key][subkey]}
                    />
                {/if}
            {/each}
        </fieldset>
    {/each}
{/await}

<style>

</style>