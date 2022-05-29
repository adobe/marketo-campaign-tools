<script>
	// let config = window.eapi.getConfig();
	import UrlGroup from '../form/UrlGroup.svelte';

	let conf = {};
	let builderFields = {};
	
	let defaultFields = {
            "baseUrl": {
                "placeholder": "Base URL",
                "type": "input",
                "index": 0
            },
            "medium": {
                "placeholder": "Medium",
                "type": "select",
                "index": 1,
                "options": [
                    {
                        "label": "EMEA",
                        "value": "EMEA"
                    },
                    {
                        "label": "Asia Pacific",
                        "value": "APAC"
                    }
                ]
            },
            "source": {
                "placeholder": "Source",
                "type": "input",
                "index": 2
            }
		};

	let entries = {};
	
	const init = (async () => {
		conf = await window.eapi.getConfig();
		builderFields = conf?.UrlBuilder?.inputs || defaultFields;
		entries = conf?.UrlBuilder?.entries || {};
	});		
	let configurationLoaded = init();

	// Functions
	const addNewRow = () => {
		let nextIndex = Object.keys(entries).length + 1;
		entries[nextIndex.toString()] = {index: nextIndex };
	}

	const removeRow = (index) => {
		delete entries[index.toString()];
		let sortedEntries =	Object.entries(entries).sort((a, b) => {
			a.index - b.index;
		})
		let sortedEntriesObject = {};
		let i = 1;
		sortedEntries.forEach((e) => {
			e[1].index = i;
			sortedEntriesObject[i.toString()] = e[1];
			i++;
		})
		
		entries = sortedEntriesObject;
		conf.UrlBuilder.entries = entries;

		updateTimer = setTimeout(() => {
			saveConfig(conf);
		}, 500)
	}

	let updateTimer;
	const urlUpdated = (e) => {
		
		clearTimeout(updateTimer);
		
		entries[e.detail.index] = e.detail.entry;
		conf.UrlBuilder = conf.UrlBuilder || {};
		conf.UrlBuilder.entries = entries;

		updateTimer = setTimeout(() => {
			saveConfig(conf);
		}, 500)
	}

	const saveConfig = ((config) => {
		window.eapi.updateConfig(config)
			.then(updated => console.log(`Configuration was updated: ${updated}`));
	})

	const exportEntries = async () => {
		window.eapi.exportEntries()
			.then((result) => {
				console.log(`Received ${result}`);
				window.open(result);
			})
			.catch(err => console.log(err));
	}
</script>
<main>
	{#await configurationLoaded}
		<div>Loading...</div>
	{:then}
		<div class="campaign-name">
			<h2>Campaign Name:</h2> {conf.CampaignDetails.name}
			<button type="button" on:click={exportEntries}>Export</button>
		</div>

		<div class="url-listings">
			<div class="url-listings__headers url-listings__section">
				<!-- Headers -->
				<h3>Index</h3>
				{#each Object.values(builderFields) as {placeholder}}
					<h3>{placeholder}</h3>
				{/each}
			</div>
			<div class="url-listings__section inputs">
				{#each Object.values(entries) as {index, values}}
				<div class="url-index">{index}</div>
					<UrlGroup entryKey={index} prefix={conf.UrlBuilder?.prefix} inputs={builderFields} values={values} on:urlUpdated={urlUpdated}></UrlGroup>
				{/each}
				<div>
					<button type="button" on:click={addNewRow}>+</button>
				</div>
			</div>
			<div class="url-listings__section outputs">
				{#each Object.values(entries) as { index, url }}
					<button on:click={(e) => { removeRow(index) }}>-</button>
					<div class="url-index">{index}</div>
					<input type="text" disable class="url-output" value="{url}" />
				{/each}
			</div>
		</div>
	{/await}
</main>

<style>
	.campaign-name {
		display: grid;
		grid-template-columns: 1fr 3fr 1fr;
		align-items: center;
	}

	.url-listings {
		display: grid;
		grid-template-columns: 1fr;
		width: 100%;
	}
	
	.url-listings__headers > h3 {
		border: 1px solid grey;
	}

	.url-listings__section {
		display: grid;
		grid-template-columns: 1fr 4fr repeat(5, 2fr);
	}	

	.url-listings__section.outputs {
		grid-template-columns: 1fr 1fr 13fr;
	}

	.url-index {
		text-align: center;
	}
</style>