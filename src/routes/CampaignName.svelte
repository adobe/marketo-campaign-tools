<script>
	import { createEventDispatcher } from 'svelte';
	import Input from '../form/Input.svelte';
	import TextArea from '../form/Textarea.svelte';
	import Select from '../form/Select.svelte'; 
	import Date from '../form/Date.svelte';
	
	// Utilities
	import { formatDate } from '../lib/utils';

	let urlComponents = new Map();
	let indices = new Set();
	let cName = '';

	// Establish the first set of campaign details immediately
	let inputs = {
		"campaignDate": {
			"label": "Campaign Date",
			"index": 9,
			"type": "date",
			"subs": {}
		},
		"campaignDetails": {
			"label": "Campaign Details",
			"placeholder": "Details",
			"index": 5,
			"type": "input",
			"subs": {}
    	},
		"campaignType": {
			"label": "Campaign Type",
			"placeholder": "Input Type",
			"index": 6,
			"type": "input",
			"subs": {}
    	},
	};
	
	let delimiter = "_";
	let config = {};	

	// Get saved details and configurations, initialize page
	async function init() {
		config = await window.eapi.getConfig();
		
		if (config !== undefined) {
			Object.assign(inputs, config.CampaignDetails?.Inputs);
			delimiter = config.Delimiter;	
		}
		config.CampaignDetails = config.CampaignDetails || {"name": ""}
		cName = config.CampaignDetails.name;
		config.ReplacePattern = config.ReplacePattern || { pattern: "\\s", symbol: "-"};
		setIndicies();

		return config;
	}

	// Functions
	
	const setIndicies = (() => {
		inputs = Object.fromEntries(Object.entries(inputs).sort(([,a],[,b]) => a.index - b.index))
		window.eapi.sortConfig(config);
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
		
		let replacePattern = new RegExp(config.ReplacePattern.pattern, 'g');
		let replaceSymbol = config.ReplacePattern.symbol;
		let sorted = Array.from(indices).sort();

		cName = '';
		sorted.forEach(i => {
			let comp = urlComponents.get(i);
			switch (comp.type) {
				case "date": 
					cName += `${formatDate(comp)}${delimiter}`;
					break;
				case "input": 
					cName += `${getSubstitutions(urlComponents.get(i))}${delimiter}`;
					break;
				case "select": 
					cName += `${getSubstitutions(urlComponents.get(i))}${delimiter}`;
					break;
			}
			
		})
		cName = cName.replaceAll(replacePattern, replaceSymbol);
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