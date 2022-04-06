<script>
	import CampaignName from './routes/CampaignName.svelte';
	import UrlGenerator from './routes/UrlGenerator.svelte';
	import Configuration from './routes/Configuration.svelte';

	let page = CampaignName;
</script>

<div class="menu-container">
	<menu>
		<li>
			<button on:click="{() => page = Configuration}">Configure</button>
		</li>
		<li>
			<button on:click="{() => page = CampaignName}">Generate Name</button>
		</li>
		<li>
			<button on:click="{() => page = UrlGenerator}">URL</button>
		</li>
	</menu>
</div>
<svelte:component this={page} />

<style>
	.menu-container {
		display: grid;
		grid-template-columns: 15vw 1fr 15vw;
	}

	menu {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		grid-auto-rows: 1fr;
		grid-column-start: 2;
		list-style: none;
		padding: 0;
		width: 100%;
	}

	li {
		height: 100%;
	}

	button {
		width: 100%;
		height: 100%;
	}
</style>

