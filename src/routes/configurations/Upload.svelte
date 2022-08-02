<script>
    import { downloadFile } from '../../lib/utils';

    let files;
    let config = {};
    let configurationOutput;

    const init = (async() => {
        config = await window.eapi.getConfig();
        if (config.configPath) {
            console.log("Loaded configuration");
            files = [config.configPath];
            configurationOutput = JSON.stringify(config, null, 2)
        }
        return true
    })

    let initialization = init();

    const setFileToUpload = () => {
        window.eapi.setUploadPath(files[0].name, files[0].path)
            .then(conf => {
                config = conf;
                configurationOutput = JSON.stringify(config, null, 2)
            })
            .catch(err => {
                console.log(err);
            });
    }
</script>
<main>
    {#await initialization}
        <div>Loading...</div>
    {:then}
        <form>
            <input type="file" id="myFile" name="filename" bind:files>
            <button type="button" on:click|preventDefault={setFileToUpload}>Upload</button>    
            <a href="{config.configPath}" download={`${config.CampaignDetails.name}-config.json`} target="_blank">Download</a>
            <div class="loaded-file">
                <b>Currently loaded file:</b> {files ? files[0] : "No configuration specified"}
            </div>
            <pre>
                {configurationOutput}
            </pre>
        </form> 
    {/await}
</main>
<style>
    .loaded-file {
        padding: 1rem 0;
    }
</style>