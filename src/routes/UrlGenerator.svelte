<script>
	// let config = window.eapi.getConfig();
	import UrlGroup from '../form/UrlGroup.svelte';

	let conf = window.eapi.getConfig();
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
	let builderFields = conf?.UrlBuilder?.inputs || defaultFields;

	const entries = conf?.UrlBuilder?.entries || {};

	// Functions
	const addNewRow = () => {
		console.log("adding new row");
	}

	const urlUpdated = (e) => {
		entries[e.detail.index] = e.detail.entry;
		window.eapi.entries(entries);
		console.log(e.detail.entry);
	}

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
	<div class="campaign-name">
		<h2>Campaign Name:</h2> {window.eapi.campaignName()}
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
			<div>{index}</div>
				<UrlGroup entryKey={index} inputs={builderFields} values={values} on:urlUpdated={urlUpdated}></UrlGroup>
			{/each}
			<div>
				<button type="button" on:click={addNewRow}>+</button>
			</div>
		</div>
		<div class="url-listings__section outputs">
			{#each Object.values(entries) as { index, url }}
				<div>{index}</div>
				<input type="text" disable class="url-output" value="{url}" />
			{/each}
		</div>
	</div>
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
		grid-template-columns: 1fr 14fr;
	}
</style>