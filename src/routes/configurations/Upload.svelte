<script>
    import { onMount } from 'svelte';
    
    let files;
    let config = {};

    onMount(async() => {
        let loadedConfiguration = window.eapi.getConfig()?.configurationPath;
        if (loadedConfiguration) {
            console.log("Loaded configuration");
            files = [loadedConfiguration];
        }
    })

    const setFileToUpload = () => {
        window.eapi.setUploadPath(files[0].name, files[0].path);
    }

    const showConfigration = () => {
        config = window.eapi.getConfig();
        console.log(`The current configuration is: ${JSON.stringify(config, 2)}`);
    }
</script>

<form>
    <input type="file" id="myFile" name="filename" bind:files>
    <button type="button" on:click|preventDefault={setFileToUpload}>Upload</button>    
    <button type="button" on:click={showConfigration}>Get Config</button>
    <div class="loaded-file">
        <b>Currently loaded file:</b> {files ? files[0] : "No configuration specified"}
    </div>
    <pre>
        {JSON.stringify(config, null, 2)}
    </pre>
</form> 

<style>
    .loaded-file {
        padding: 1rem 0;
    }
</style>