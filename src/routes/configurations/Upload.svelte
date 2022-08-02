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

    const resetLocalConfig = () => {
        const confirmMsg = "This resets your current configuration to factory defaults. Are you sure?"
        if(confirm(confirmMsg)) {
            window.eapi.reset()
                .then(conf => {
                    config = conf;
                    configurationOutput = JSON.stringify(config, null, 2);
                })
                .catch(err => {
                    console.log(err);
                    configurationOutput = { status: "err", msg: err}
                });
        }
    }
</script>
<main>
    {#await initialization}
        <div>Loading...</div>
    {:then}
        <form>
            <input type="file" id="myFile" name="filename" bind:files>
            <button class="upload" type="button" on:click|preventDefault={setFileToUpload}>Upload</button>    
            <a href="{config.configPath}" disabled={!files} download={`${config.CampaignDetails.name}-config.json`} target="_blank">Download</a>
            <button class="reset" type="button" on:click|preventDefault={resetLocalConfig}>Reset Configuration</button>
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

    button {
        outline: none;
        font-weight: bold;
        padding: 0.5rem;
    }

    button.upload {
        color: white;
        background-color: red;
    }

    button.reset {
        color: slategray;
        background-color: #f2f2f2;
    }

    button.reset:hover {
        border: 1px solid red;
        color: red;
        background-color: #f2f2f2;
    }

    a { 
        text-decoration: none;
        border: 1px solid;
        padding: 0.5rem;
        background-color: #888;
        color: white;
        font-weight: bold;
        border-radius: 4px;
    }
</style>