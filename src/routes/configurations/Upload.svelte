<script>
    
    let files;
    let config = {};

    const init = (async() => {
        config = await window.eapi.getConfig();
        if (config.configurationPath) {
            console.log("Loaded configuration");
            files = [config.configurationPath];
        }
        return true
    })

    let initialization = init();

    const setFileToUpload = () => {
        window.eapi.setUploadPath(files[0].name, files[0].path);
    }
</script>
<main>
    {#await initialization}
        <div>Loading...</div>
    {:then}
        <form>
            <input type="file" id="myFile" name="filename" bind:files>
            <button type="button" on:click|preventDefault={setFileToUpload}>Upload</button>    
            <!-- <button type="button" on:click={showConfigration}>Get Config</button> -->
            <div class="loaded-file">
                <b>Currently loaded file:</b> {files ? files[0] : "No configuration specified"}
            </div>
            <pre>
                {JSON.stringify(config, null, 2)}
            </pre>
        </form> 
    {/await}
</main>
<style>
    .loaded-file {
        padding: 1rem 0;
    }
</style>