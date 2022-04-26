<script>
	import Input from '../form/Input.svelte';
	import TextArea from '../form/Textarea.svelte';
	import Counter from '../form/Counter.svelte';
	import Select from '../form/Select.svelte';
	
	let url = "Enter data to start creating URL";

	let urlComponents = new Map();
	let indices = new Set();

	// TODO: Set this from a config
	let keyMappings = new Map();
	let dpaMappings = new Map();
	dpaMappings.set("Item 1A", "I1A");
	dpaMappings.set("Item 1B", "I1B");
	dpaMappings.set("Item 1C", "I1C");

	let geos = window.electronAPI.getConfig()?.Geos;

	// Add maps to name map
	keyMappings.set("dataPointA", dpaMappings);

	const handleChange = (e) => {
		console.log(`${e.target.dataset.index}: ${e.target.name} - ${e.target.value}`);
		console.log(e.target);
		
		// Add to indicies for sorting
		indices.add(e.target.dataset.index);
		// Add to set for composing
		urlComponents.set(e.target.dataset.index, `${e.target.name}:${e.target.value}`);
		updateUrl();
	}
	
	// Set replacement pattern and replacement symbol
	let replaceConfig = window.electronAPI.getConfig()?.ReplacePattern;
	let replacePattern = new RegExp(replaceConfig.pattern, 'g');
	let replaceSymbol = replaceConfig.symbol;
	const updateUrl = () => {
		let sorted = Array.from(indices).sort();
		
		// TODO: Figure out mapping of names to entries
		url = '';
		sorted.forEach(i => {
			let valuePair = urlComponents.get(i).split(":");
			let mappedValue = getMappedValue(valuePair);
			url += `${mappedValue}_`;
		})

		url = url.replaceAll(replacePattern, replaceSymbol);
		url = url.substring(0, url.length - 1);
	}

	const getMappedValue = (pair) => {
		let mappedValue = keyMappings?.get(pair[0])?.get(pair[1]);
		return mappedValue === undefined ? pair[1] : mappedValue;
	}
</script>
<main>
	<Input label="Campaign ID" name="campaignID" placeholder="Campaign ID" on:input={handleChange} index={1} />
	<Input label="Data Point A" name="dataPointA" placeholder="Enter Data Point A" on:input={handleChange} index={2} />
	<Input label="Data Point B" name="dataPointB" placeholder="Eneter Data Point B" on:input={handleChange} index={3} />
	<Select label="Geo" name="geo" placeholder="Enter GEO" on:input={handleChange} options={geos} index={4} />
	<Input label="Campaign Details" name="campaignDetails" placeholder="Enter Campaign Details" on:input={handleChange} index={5} />
	<Input label="Campaign Type" name="campaignType" placeholder="Enter Campaign Type" on:input={handleChange} index={6} />
	
	<TextArea name="generatedUrl" text={url} />
	<Counter label={"Number of characters:"} count={url.length} />
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