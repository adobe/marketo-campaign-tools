<script>
    import { onMount } from 'svelte';
    
    let files;

    onMount(async() => {
        let loadedConfiguration = window.electronAPI.getConfig()?.userConfigPath;
        if (loadedConfiguration) {
            console.log("Loaded configuration");
            files = [loadedConfiguration];
        }
    })

    const setFileToUpload = () => {
        window.electronAPI.setUploadPath(files[0].name, files[0].path);
    }

    const showConfigration = () => {
        console.log(`The current configuration is: ${JSON.stringify(window.electronAPI.getConfig(), 2)}`)
    }
</script>

<form>
    <div>
        <b>Currently loaded file:</b> {files ? files[0] : "No configuration specified"}
    </div>
    <input type="file" id="myFile" name="filename" bind:files>
    <button type="button" on:click|preventDefault={setFileToUpload}>Upload</button>    
    <button type="button" on:click={showConfigration}>Get Config</button>
</form> 