<script>
	import CampaignName from './routes/CampaignName.svelte';
	import UrlGenerator from './routes/UrlGenerator.svelte';

	// Configuration Components
	import Parameters from './routes/configurations/Parameters.svelte';
    import Dimensions from './routes/configurations/Dimensions.svelte';
    import Upload from './routes/configurations/Upload.svelte';

	let page = CampaignName;
	let showConfig;

	// TODO: Set last page handling across app
	if (sessionStorage.getItem("lastPage") === "Dimensions") {
		page = Configuration;
	}

	const revealConfig = () => {
		if (page == Parameters || page == Dimensions || page == Upload) {
			showConfig = true;
		} else {
			showConfig = !showConfig;
		}
	}
	
</script>

<div class="header">
	Header
</div>
<div class="wrapper">
	<menu>
		<li on:click="{() => page = CampaignName}">
			Campaign Name
		</li>
		<li on:click="{() => page = UrlGenerator}">
			URL
		</li>
		<li on:click="{() => revealConfig()}">
			Configure
			<menu class="configuration-menu" class:hide="{!showConfig}">
				<li on:click={() => page = Parameters} class:selected="{page == Parameters}">
					Parameters
				</li>
				<li on:click={() => page = Dimensions} class:selected="{page == Dimensions}">
					Dimensions
				</li>
				<li on:click={() => page = Upload} class:selected="{page == Upload}">
					Upload
				</li>
			</menu>
		</li>
	</menu>
	<svelte:component this={page} />
</div>

<style>
	.wrapper {
		display: grid;
		grid-template-columns: minmax(10rem, 15%) 1fr;
		margin-right: 1rem;
	}

	menu {
        margin-left: 0;
        padding-left: 1rem;
        width: 100%;
        height: fit-content;
		border-right: 2px solid lightgray;
	}

	li {
		height: 100%;
		list-style-type: none;
		padding: 0.5rem 0;
	}

	.configuration-menu {
		border: none;
		width: 90%;
		margin-left: 10%;
		z-index: 500;
	}

	.hide {
		display:none;
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
	}

	:global(.header) {
		display: grid;
		grid-template-columns: 1fr;
		margin-bottom: 1rem;
		padding-left: 2rem;
		background-color: #fff;
		border-bottom: 1px solid #eaeaea;
		height: 3rem;
		align-items: center;
	}

	:global(.cmp-input) {
		display: grid;
        width: 100%;
        grid-template-columns: 1fr 3fr;
        align-items: center;
        padding: 0 2rem;
		width: calc(100% - 4rem);
	}

	@media (max-width: 640px) {
		:global(.cmp-input) {
			grid-template-columns: 1fr;
		}
	}
	
</style>

