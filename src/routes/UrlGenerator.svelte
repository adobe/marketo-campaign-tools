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

	// TODO: Get this from the configuration
	const entries = {
		1: {
			index: 1, 
			url: 'http://', 
			values: {
				"baseUrl": "http://adobe.com",
				"medium": "ghostTalker", 
				"source": "fakeNews",
				"term": "limited"
			}
		},
		2: {
			index: 2, 
			url: 'file://',
			values: {
				"baseUrl": "http://google.com",
				"medium": "APAC", 
				"source": "unknown",
				"term": "90day"
			}
		},
		3: {
			index: 3, 
			url: 'http://www.adobe.com'
		}
	}

	// Functions
	const addNewRow = () => {
		console.log("adding new row");
	}

	const urlUpdated = (e) => {
		
		// Add to entry to array and reassign entries to itself to trigger svelte reactivity
		entries[e.detail.index] = e.detail.entry;
		console.log(e.detail.entry);
	}
	
</script>
<main>
	<div class="campaign-name">
		<h2>Campaign Name:</h2> {window.eapi.campaignName()}
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
		grid-template-columns: 1fr 3fr;
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