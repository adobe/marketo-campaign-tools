<script>
	import Input from '../form/Input.svelte';
	import TextArea from '../form/Textarea.svelte';
	import Counter from '../form/Counter.svelte';
	import Select from '../form/Select.svelte';
	
	let cName = '';
	let previousUrl = '';

	let urlComponents = new Map();
	let indices = new Set();

	// Establish the first set of campaign details immediately
	// TODO: Determine default index positions
	let inputs = {
		"campaignID": {
			"label": "Campaign ID",
			"placeholder": "Input Campaign ID",
			"index": 1,
			"type": "input",
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

	config = window.eapi.getConfig();
	cName = window.eapi.campaignName() || '';

	if (config !== undefined) {
		Object.assign(inputs, config.Inputs);
		delimiter = config.Delimiter
	}

	// Set replacement pattern and replacement symbol

	let replaceConfig = config.ReplacePattern || { pattern: "\\s", symbol: "-"};
	
	let replacePattern = new RegExp(replaceConfig.pattern, 'g');
	let replaceSymbol = replaceConfig.symbol;


	// Functions
	const handleChange = (e, input) => {
		
		// Add to indicies for sorting
		indices.add(e.target.dataset.index);
		// Add to set for composing
		input.value = e.target.value;
		urlComponents.set(e.target.dataset.index, input); 
		updateUrl();
	}
	
	const updateUrl = () => {
		let sorted = Array.from(indices).sort();
		
		cName = '';
		sorted.forEach(i => {
			cName += `${getSubstitutions(urlComponents.get(i))}${delimiter}`;
		})

		cName = cName.replaceAll(replacePattern, replaceSymbol);
		cName = cName.substring(0, cName.length - 1);
	}

	const getSubstitutions = (input) => {
		if (input.subs) {
			return input.subs[input.value] ? input.subs[input.value] : input.value;
		} 
		return input.value;
	}

	// Configure auto-save patterns
	setInterval(() => {
		if (cName !== previousUrl) {
			config.Inputs = inputs;
			config.CampaignDetails = config.CampaignDetails || {};
			config.CampaignDetails.name = cName;
			window.eapi.updateConfig(config)
			window.eapi.campaignName(cName);
			previousUrl = cName;
		}
	}, 3000)
</script>
<main>
	{#each Object.keys(inputs) as key }
		{#if inputs[key].type === "select"}
			<Select 
				label="{inputs[key].label}" 
				name="{key}" placeholder="{inputs[key].placeholder}" 
				on:input={(e) => handleChange(e, inputs[key])} 
				options={inputs[key].options} 
				index={inputs[key].index} 
				value={inputs[key].value ? inputs[key].value : ''}
			/>
		{:else}
			<Input 
				label="{inputs[key].label}" 
				name="{key}" 
				placeholder="{inputs[key].placeholder}" 
				on:input={(e) => handleChange(e, inputs[key])} 
				index={inputs[key].index} 
				value={inputs[key].value ? inputs[key].value : ''}
			/>
		{/if}
	{/each}

	<!-- This area is for output only  -->
	<TextArea name="generatedUrl" text={cName} />
	<Counter label={"Number of characters:"} count={cName.length} />
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>