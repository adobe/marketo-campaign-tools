<script>
    import { createEventDispatcher } from 'svelte';
    import Select from '../form/Select.svelte';
    import Input from '../form/Input.svelte';

    let conf = window.eapi.getConfig();
    let parameterPrefix = conf.UrlBuilder?.prefix || "utm_";
            
    // Setup variables

    export let entryKey;
    const dispatch = new createEventDispatcher();
    
    let url;
    export let values = {};
    export let inputs = {};

    let urlComponents = new Map();
    let indices = new Set();

    // Functions
    const handleChange = (e, input) => {
        let i = e.target.dataset.index;
        indices.add(i, input);
        input.value = e.target.value;
        input.name = e.target.name;
        values[input.name] = input.value;

        urlComponents.set(i, input);
        updateUrl();
    }

    const updateUrl = () => {
        let sorted = Array.from(indices).sort();
        let firstParam = true;

        sorted.forEach(i => {
            let component = urlComponents.get(i);
            if (component.name == "baseUrl") {
                url = `${component.value}`;
            } else {
                url += `${firstParam ? '?' : '&'}${parameterPrefix}${component.name}=${component.value}`;
                firstParam = false;
            }

            console.log(`Url has been updated to :${url}`)
        })

        dispatch('urlUpdated', { 
            "index": entryKey,
            "entry": {
                index: entryKey, 
                url: url,
                values: values
            }
        });
    }
    
</script>

{#each Object.keys(inputs) as key }
		{#if inputs[key].type === "select"}
			<Select 
				name="{key}" placeholder="{inputs[key].placeholder}" 
				on:input={(e) => handleChange(e, inputs[key])} 
				options={inputs[key].options} 
				index={inputs[key].index} 
				value={values[key] || ''}
			/>
		{:else}
			<Input 
				name="{key}" 
				placeholder="{inputs[key].placeholder}" 
				on:input={(e) => handleChange(e, inputs[key])} 
				index={inputs[key].index} 
				value={values[key] || ''}
			/>
		{/if}
	{/each}

<style>
    input {
        width: 100%;
    }
</style>