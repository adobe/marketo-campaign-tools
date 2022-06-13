<script>
	// let config = window.eapi.getConfig();
	import UrlGroup from '../form/UrlGroup.svelte';
	import { downloadFile } from '../lib/utils';

	let conf = {};
	let builderFields = {};
	
	let entries = {};
	let totalColumns;
	
	const init = (async () => {
		conf = await window.eapi.getConfig();
		builderFields = conf?.UrlBuilder?.inputs || defaultFields;
		entries = conf?.UrlBuilder?.entries || {};
		totalColumns = Object.keys(builderFields).length;
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
</script>

<style>
	.url-parameters {
		display: grid;
		grid-template-columns: 5% repeat(var(--totalColumns),1fr);
	}

	.url-listings {
		display: grid;
		grid-template-columns: 1fr;
		width: 75vw;
	}
	
	.url-listings__headers > h3 {
		border-right: 1px solid grey;
		padding-left: 0.5rem;
		display: grid;
		align-items: center;
		font-size: 0.9em;
	}

	.url-listings__section.outputs {
		display: grid;
		grid-template-columns: 1fr 1fr 13fr;
	}

	.url-index {
		text-align: center;
	}

	.url-list__header {
		height: 3rem;
		margin: 0.5rem 0;
		padding: 0.5rem 1rem;
		width: calc(100% - 2rem);
		display: grid;
		border-bottom: 2px solid red;
		grid-template-columns: 1fr 15%;
		align-items: center;
	}

	.url-list__header div {
		align-items: center;
		display: grid;
	}

	.url-list__header button {
		margin-bottom: 0;
	}
</style>

<main>
	{#await configurationLoaded}
		<div>Loading...</div>
	{:then}
		<div class="url-listings">
			<div class="url-listings__headers url-parameters url-listings__section" style="--totalColumns:{totalColumns}">
				<!-- Headers -->
				<h3>Index</h3>
				{#each Object.values(builderFields) as {label}}
					<h3>{label}</h3>
				{/each}
				{#each Object.values(entries) as {index, values}}
				<div class="url-index">{index}</div>
					<UrlGroup entryKey={index} prefix={conf.UrlBuilder?.prefix} inputs={builderFields} values={values} on:urlUpdated={urlUpdated}></UrlGroup>
				{/each}
				<div>
					<button type="button" on:click={addNewRow}>+</button>
				</div>
			</div>
		</div>
		<div class="url-list__header">
			<div><h2>URLs</h2></div>
			<button on:click={() => { downloadFile("entries") }}>Export</button>
		</div>
		<div class="url-listings__section outputs">
			{#each Object.values(entries) as { index, url }}
				<button on:click={(e) => { removeRow(index) }}>-</button>
				<div class="url-index">{index}</div>
				<input type="text" disable class="url-output" value="{url}" />
			{/each}
		</div>
	{/await}
</main>

