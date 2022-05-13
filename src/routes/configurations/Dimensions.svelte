<script>

let config = {};

const init = async() => {
    config = await window.eapi.getConfig();
}

let initalization = init();

</script>
<h1>Dimensions</h1>
{#await initalization}
    <div>Loading...</div>
{:then}
    <div>Loaded</div>
    <div>{JSON.stringify(config.CampaignDetails.Inputs, null, 2)}</div>
{/await}