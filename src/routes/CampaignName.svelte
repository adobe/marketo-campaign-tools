<script>
	import { createEventDispatcher } from 'svelte';
	import { sortObject } from '../lib/utils';
	import Input from '../form/Input.svelte';
	import TextArea from '../form/Textarea.svelte';
	import Select from '../form/Select.svelte'; 
	import Date from '../form/Date.svelte';
	
	// Utilities
	import { formatDate } from '../lib/utils';

	let urlComponents = new Map();
	let indices = new Set();
	let cName = '';
	let inputs =  {};

	// Establish the first set of campaign details immediately
	let config = {};	

	// Get saved details and configurations, initialize page
	async function init() {
		config = await window.eapi.getConfig();
		
		if (config !== undefined) {
			Object.assign(inputs, config.CampaignDetails?.Inputs);
		}
		config.CampaignDetails = config.CampaignDetails || {"name": ""}
		cName = config.CampaignDetails.name;
		config.ReplacePattern = config.ReplacePattern || { pattern: "\\W", symbol: "-"};
		setIndicies();

		return config;
	}

	// Functions
	
	const setIndicies = (() => {
		inputs = Object.fromEntries(Object.entries(inputs).sort(([,a],[,b]) => a.index - b.index))
		config.CampaignDetails.Inputs = sortObject(config.CampaignDetails.Inputs);
		Object.values(inputs).forEach((input) => {
			if (input.value) {
				addToIndexAndComponents(input);
			}
		})
	}) 

	const addToIndexAndComponents = ((input) => {
		// Add to indicies for sorting
		indices.add(input.index);
		// Add to set for composing
		input.value = input.value;
		urlComponents.set(input.index, input); 
		updateUrl();
	})

	// Set init promise to a variable to trigger svelte reactivity for the #await block in HTML
	let initialization = init();

	const handleChange = (e, input) => {
		input.value = e.target.value;
		addToIndexAndComponents(input)
		updateUrl();
	}
	
	const dispatch = new createEventDispatcher();
	let updateTimer;
	const updateUrl = () => {
		
		// Prevent updating while this function is running
		clearTimeout(updateTimer);
		
		
		let delimiter = config.Delimiter;
		console.log(delimiter);
		let sorted = Array.from(indices).sort();

		cName = '';
		sorted.forEach(i => {
			let comp = urlComponents.get(i);
			switch (comp.type) {
				case "date": 
					cName += `${formatDate(comp)}${delimiter}`;
					break;
				case "input": 
					cName += `${encode(getSubstitutions(comp))}${delimiter}`;
					break;
				case "select": 
					cName += `${getSubstitutions(comp)}${delimiter}`;
					break;
			}
		})
		cName = cName.substring(0, cName.length - 1);
		
		config.CampaignDetails.name = cName;
		config.CampaignDetails.Inputs = inputs;

		dispatch('nameChange', { cname: cName });

		updateTimer = setTimeout(() => {
			saveConfig(config);
		}, 500)
	}

	const getSubstitutions = (input) => {
		if (input.subs) {
			return input.subs[input.value] ? input.subs[input.value] : input.value;
		} 
		return input.value;
	}

	const encode = (value) => {
		let replacePattern = new RegExp(config.ReplacePattern.pattern, 'g');
		let replaceSymbol = config.ReplacePattern.symbol;
		
		return value.replace(replacePattern, replaceSymbol)
	}

	const saveConfig = ((config) => {
		window.eapi.updateConfig(config)
			.then(updated => console.log(`Configuration was updated: ${updated}`));
	})
</script>
<main>
	{#await initialization}
		<div>...loading</div>
	{:then}
		{#each Object.keys(inputs) as key }
			{#if inputs[key].type === "select"}
				<Select 
					label="{inputs[key].label}" 
					name="{key}" 
					placeholder="{inputs[key].placeholder}" 
					tooltip="{inputs[key].tooltip}"
					on:input={(e) => handleChange(e, inputs[key])} 
					options={inputs[key].options} 
					index={inputs[key].index} 
					bind:value={inputs[key].value}
				/>
			{:else if inputs[key].type === "date"}
				<Date 
					label="{inputs[key].label}" 
					name="{key}" 
					tooltip="{inputs[key].tooltip}"
					on:change={(e) => handleChange(e, inputs[key])} 
					index={inputs[key].index} 
					bind:value={inputs[key].value} />
			{:else}
				<Input 
					label="{inputs[key].label}" 
					name="{key}" 
					tooltip="{inputs[key].tooltip}"
					placeholder="{inputs[key].placeholder}" 
					on:input={(e) => handleChange(e, inputs[key])} 
					index={inputs[key].index} 
					bind:value={inputs[key].value}
				/>
			{/if}
		{/each}

		<!-- This area is for output only  -->
		<TextArea name="generatedUrl" text={cName} placeholder="Campaign name will appear here" />
	{/await}
</main>

<style>

</style>