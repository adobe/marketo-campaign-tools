<script>
	import CampaignName from './routes/CampaignName.svelte';
	import UrlGenerator from './routes/UrlGenerator.svelte';

	// Configuration Components
	import Parameters from './routes/configurations/Parameters.svelte';
    import Dimensions from './routes/configurations/Dimensions.svelte';
    import Upload from './routes/configurations/Upload.svelte';
	import Global from './routes/configurations/Globals.svelte';

	// Import icons
	import Icon from './icons/Icon.svelte';
	import Link from './icons/link.svelte';
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
			case UrlGenerator: 
				pageName = "URL Builder";
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
	
</script>

<div class="header">
	<div class="logo">
		<Icon component={ExperienceCloud} size="small" />
		Marketo Toolkit
	</div>
	<div>{#await initalization} No Name {:then} {campaignName} {/await}</div> 
	<div>{pageName}</div>
</div>
<div class="wrapper">
	<menu class="main-menu">
		<li on:click="{() => setPage(CampaignName)}">
			<Icon component={FormTable} />Campaign Name
		</li>
		<li on:click="{() => setPage(UrlGenerator)}">
			<Icon component={Link} />URL
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
	<svelte:component this={page} on:nameChange={updateName} />
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

	.hide {
		display:none;
	}

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

	:global(.cmp-input) {
		display: grid;
        width: 100%;
        grid-template-columns: 1fr 3fr;
        align-items: center;
        padding: 0 2rem;
		width: calc(100% - 4rem);
	}

	:global(.url-parameters .cmp-input) {
		width: 100%;
		min-width: 10rem;
		grid-template-columns: 1fr;
		padding: 0;
	}

	:global(fieldset) {
		border: none;
		border-bottom: 2px solid red;
		margin-bottom: 2rem;
	}

	@media (max-width: 640px) {
		:global(.cmp-input) {
			grid-template-columns: 1fr;
		}
	}
	
</style>

