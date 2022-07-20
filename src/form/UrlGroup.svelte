<script>
    import { createEventDispatcher } from 'svelte';
    import { sort } from '../lib/utils';
    import Select from './Select.svelte';
    import Input from './Input.svelte';
    import Date from './Date.svelte'
    
    // Setup variables
    export let prefix = "utm_";
    export let entryKey;
    const dispatch = new createEventDispatcher();
    
    let url;
    export let values = {};
    export let inputs = {};
    export let showLabel = false;

    let urlComponents = new Map();
    let indices = new Set();

    // Functions
    const handleChange = (e, input) => {
        let i = e.target.dataset.index;
        indices.add(i);
        input.value = e.target.value;
        input.name = e.target.name;
        values[input.name] = input.value;

        urlComponents.set(i, input);
        setComponents();
        updateUrl();
    }

    const updateUrl = () => {
        url = '';
        
        let sorted = Array.from(indices).sort();
        let firstParam = true;

        sorted.forEach(i => {
            let component = urlComponents.get(i);
            if (component.name == "baseUrl") {
                url = `${component.value}`;
            } else {
                url += `${firstParam ? '?' : '&'}${prefix}${component.name}=${component.value}`;
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
    
    const setComponents = () => {
        Object.keys(inputs).forEach((key) => {
        if (!values[key]) {
            return;
        }
        indices.add(inputs[key].index);
        urlComponents.set(inputs[key].index, {
            name: key, 
            value: values[key]
        });
       })
    }

    setComponents();
</script>

{#each Object.keys(inputs) as key }
    {#if showLabel}
        <label>{inputs[key].label}</label>
    {/if}
    {#if inputs[key].type === "select"}
        <Select 
            name="{key}" 
            placeholder="{inputs[key].placeholder}" 
            on:input={(e) => handleChange(e, inputs[key])} 
            options={inputs[key].options} 
            index={inputs[key].index} 
            tooltip="{inputs[key].tooltip}"
            value={values ? (values[key] || '') : ''}
        />
    {:else if inputs[key].type === "date"}
        <Date 
            name="{key}" 
            on:change={(e) => handleChange(e, inputs[key])} 
            index={inputs[key].index} 
            value={values ? (values[key] || '') : ''}
            tooltip="{inputs[key].tooltip}" 
        />
    {:else}
        <Input 
            name="{key}" 
            placeholder="{inputs[key].placeholder}" 
            on:input={(e) => handleChange(e, inputs[key])} 
            index={inputs[key].index} 
            tooltip="{inputs[key].tooltip}"
            value={values[key] || ''}
        />
    {/if}
{/each}

<style>
    input {
        width: 100%;
    }
</style>