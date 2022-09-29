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
	import CampaignName from './routes/CampaignName.svelte';
	import UrlTable from './routes/UrlTable.svelte';
	import UrlBuilder from './routes/UrlBuilder.svelte';

	// Configuration Components
	import Parameters from './routes/configurations/Parameters.svelte';
    import Dimensions from './routes/configurations/Dimensions.svelte';
    import Upload from './routes/configurations/Upload.svelte';
	import Global from './routes/configurations/Globals.svelte';

	// Import icons
	import Icon from './icons/Icon.svelte';
	import Links from './icons/links.svelte';
	import Puzzle from './icons/puzzle.svelte';
	import Dimension from './icons/dimensions.svelte';
	import FileUpload from './icons/file-upload.svelte';
	import FormTable from './icons/form-table.svelte';
	import ExperienceCloud from './icons/experienceCloud.svelte';
	import Earth from './icons/earth.svelte';

	let page = CampaignName;
	let showConfig;

	let configurationPages = [Parameters, Dimensions, Upload, Global];

	const revealConfig = () => {
		if (configurationPages.includes(page)) {
			showConfig = true;
		} else {
			showConfig = !showConfig;
		}
	}

	// Initial configuration to get Campaign Name;
	let campaignName;
	async function init() {
		let config = await window.eapi.getConfig();
		campaignName = config.CampaignDetails.name;
	}
	let initalization = init();

	const updateName = (e) => {
		campaignName = e.detail.cname;
	}

	// Page Name Logic
	let pageName;
	const setPage = (comp) => {
		page = comp;
		switch (comp) {
			case CampaignName: 
				pageName = "Campaign Name";
				showConfig = false;
				break;
			case UrlTable: 
				pageName = "URL Manager - Table";
				showConfig = false;
				break;
			case UrlBuilder: 
				pageName = "URL Manager - Detail";
				showConfig = false;
				break;
			case Parameters: 
				pageName = "Parameters";
				break;
			case Dimensions: 
				pageName = "Dimensions";
				break;
			case Upload: 
				pageName = "Import";
				break;
			case Global:
				pageName = "Globals";
				break;
			default:
				pageName = "No Page";
			}
	}

	setPage(page);

	const handleUrlViewChange = (e) => {
		setPage(e.detail.view === "table" ? UrlTable : UrlBuilder);
	}
	
</script>

<div class="header">
	<div class="logo">
		<Icon component={ExperienceCloud} size="small" />
		Marketo Campaign Tools
	</div>
	<div>{#await initalization} No Name {:then} {campaignName} {/await}</div> 
	<div>{pageName}</div>
</div>
<div class="wrapper">
	<menu class="main-menu">
		<li on:click="{() => setPage(CampaignName)}">
			<Icon component={FormTable} />Campaign Name
		</li>
		<li on:click="{() => setPage(UrlTable)}">
			<Icon component={Links} />URL Manager
		</li>
		<li on:click="{() => revealConfig()}" class="configuration-list-item">
			Configure
			<menu class="configuration-menu" class:hide="{!showConfig}">
				<li on:click={() => setPage(Dimensions)} class:selected="{page == Dimensions}">
					<Icon component={Dimension} />Dimensions
				</li>
				<li on:click={() => setPage(Parameters)} class:selected="{page == Parameters}">
					<Icon component={Puzzle} />Parameters
				</li>
				<li on:click={() => setPage(Global)} class:selected="{page == Global}">
					<Icon component={Earth} />Globals
				</li>
				<li on:click={() => setPage(Upload)} class:selected="{page == Upload}">
					<Icon component={FileUpload} />Upload
				</li>
			</menu>
		</li>
	</menu>
	<svelte:component this={page} on:nameChange={updateName} on:viewChanged={handleUrlViewChange} />
</div>

<style>
	.logo {
		display: grid;
		grid-template-columns: 48px 1fr;
		align-items: center;
	}

	.wrapper {
		display: grid;
		grid-template-columns: minmax(10rem, 15%) 1fr;
		margin-right: 1rem;
	}


	/** 
	* SECTION: Main menu
	*/
	menu {
        margin-left: 0;
        padding-left: 1rem;
        width: calc(100% - 1rem);
        height: fit-content;
	}

	li {
		height: 100%;
		list-style-type: none;
		padding: 0.5rem 0;
		display: grid;
		grid-template-columns: 2rem 1fr;
		column-gap: 1rem;
		align-items: center;
	}

	li:hover {
		font-weight: bold;
	}

	.main-menu { 
		fill: #6a6a6a;
	}

	.main-menu .configuration-menu > li { 
		font-weight: normal;
	}

	.main-menu .configuration-menu > li:hover { 
		font-weight: bold;
	}

	/* The folloing are related to the main menu, but required as global as they target elements in sub-components */
	:global(li:hover div svg) {
		fill: rgb(255,0,0);
        transform: scale(1.25);
        transition: transform 0.2s, fill 0.2s;
	}

	:global(.main-menu .configuration-menu > li div svg) {
		fill: #6a6a6a;
        transform: none;
        transition: none;
	}

	:global(.main-menu .configuration-menu > li:hover div svg) {
		fill: rgb(255,0,0);
        transform: scale(1.25);
        transition: transform 0.2s, fill 0.2s;
	}

	.configuration-list-item {
		align-items: start;
		grid-template-columns: 1fr;
	}

	.configuration-menu {
		padding-left: 1rem;
		border-left: 2px solid slategray
	}	

	/** 
	* SECTION: Header
	*/
	.header {
		display: grid;
		grid-template-columns: 1fr 3fr 1fr;
		margin-bottom: 1rem;
		padding-left: 2rem;
		background-color: #fff;
		border-bottom: 1px solid #eaeaea;
		height: 3rem;
		align-items: center;
	}

	.header :first-child {
		text-align: left;
	}

	.header :nth-child(2) {
		text-align: center;
	}

	.header :last-child {
		text-align:right;
		padding-right: 1rem;
		text-transform: uppercase;
		font-weight: bold;
		font-size: 0.8em;
	}

	/** Global Styles */
	:global(body) {
		background-color: #f5f5f5;
	}

	:global(main) {
		margin: 0 1rem; 
		padding: 1rem 0;
		background-color: #fff;
		border: 1px solid #eaeaea;
		border-radius: 4px;
		margin-right: 1rem;
		overflow-y: scroll;
	}

	:global(.hide) {
		display:none;
	}

	/** 
	* SECTION: Forms and Inputs
	*/
	:global(.cmp-input) {
		display: grid;
        width: 100%;
        grid-template-columns: 1fr 3fr;
        align-items: center;
        padding: 0 2rem;
		width: calc(100% - 4rem);
	}

	:global(.cmp-input input) {
		border: none;
		border-bottom: 1px solid #ccc;
	}

	:global(.url-parameters .cmp-input) {
		width: 100%;
		min-width: 10rem;
		grid-template-columns: 1fr;
		padding: 0;
		overflow-x: scroll;
	}

	:global(fieldset) {
		border: none;
		border-bottom: 2px solid red;
		margin-bottom: 2rem;
	}

	:global(button.primary) {
        background-color: red; 
        color: white;
        border-radius: 4px;
    }

	:global(button.secondary) {
        background-color: slategray; 
        color: white;
        border-radius: 4px;
    }

	@media (max-width: 640px) {
		:global(.cmp-input) {
			grid-template-columns: 1fr;
		}
	}
	
</style>

