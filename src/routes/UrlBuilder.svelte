<!--
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
-->
<script>
	// let config = window.eapi.getConfig();
	import { sortObject, addNewRow } from '../lib/utils';
	import UrlGroup from '../form/UrlGroup.svelte';
	import ViewSelect from '../form/ViewSelect.svelte';

	let conf = {};
	let builderFields = {};
	
	let entries = {};
	let activeIndex;
	
	const init = (async () => {
		conf = await window.eapi.getConfig();
		builderFields = conf?.UrlBuilder?.inputs || defaultFields;
		builderFields = sortObject(builderFields);
		entries = conf?.UrlBuilder?.entries || {};
		entries = sortObject(entries);

		let entriesList = Object.values(entries);
		activeIndex = entriesList.length > 0 ? entriesList[0].index : 0;
	});		
	let configurationLoaded = init();

	// Functions
	const addRow = () => {
		entries = addNewRow(entries, builderFields);
		activeIndex = Object.keys(entries).length;
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
		console.log(e.detail);
		entries[activeIndex] = e.detail.entry;
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

<main>
	{#await configurationLoaded}
		<div>Loading...</div>
	{:then}
		<div class="url-listings">
			<div class="url-listings__headers url-parameters url-listings__section">
				<!-- Headers -->
				<div class="index-column">
					<h3>URL</h3>
					<h2>{activeIndex}</h2>				
				</div>
				<div class="configuration">
					<UrlGroup 
						entryKey={activeIndex} 
						prefix={conf.UrlBuilder?.prefix} 
						inputs={builderFields} 
						showLabel=true
						values={entries[activeIndex]?.values} 
						on:urlUpdated={urlUpdated}></UrlGroup>
				</div>
			</div>
		</div>
		<div class="url-list__header">
			<div><h2>URLs</h2></div>
		</div>
		<div class="url-listings__section outputs">
			{#each Object.values(entries) as { index, url }}
				<button on:click={(e) => { removeRow(index) }}>-</button>
				<div class="url-index" on:click={() => activeIndex = index } class:active={activeIndex === index}>{index}</div>
				<input type="text" disable class="url-output" value="{url}" />
			{/each}
		</div>
		<ViewSelect 
			on:viewChanged selectedPage="detail" 
			on:addNewRow={addRow}
		/>
	{/await}
</main>

<style>
	.url-parameters {
		display: grid;
		grid-template-columns: 1fr 7fr;
		column-gap: 1rem;
	}

	.index-column { 
		display: grid;
		grid-template-columns: 1fr;
		align-items: center;
		justify-content: center;
		text-align: center;
		height: 4rem;
		margin: 1rem;
		/* font-size: 2.5em; */
		border-bottom: 2px solid red;
	}

	.index-column h2,h3 {
		margin: 0;
	}

	.url-parameters .configuration {
		display: grid;
		grid-template-columns: 1fr 4fr;
		column-gap: 1rem;
		row-gap: 0.5rem;
		align-items: center;
	}

	.url-listings {
		display: grid;
		grid-template-columns: 1fr;
		width: 75vw;
	}


	.url-listings__section.outputs {
		display: grid;
		grid-template-columns: 1fr 1fr 13fr;
		padding-bottom: 3rem;
		row-gap: 0.25rem;
	}

	.url-listings__section.outputs button {
		margin: 0.25rem; 
	}

	:global(.url-listings__section.outputs input) {
		border: none;
		border-bottom: 1px solid #ccc;
	}

	.url-index {
		display: flex;
		align-items: center;
		justify-content: center;
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

	.url-index.active {
		background-color: red;
		color: white;
		font-weight: bold;
	}
</style>

