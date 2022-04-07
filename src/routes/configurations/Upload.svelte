<script>
    let file;

    const setFileToUpload = () => {
        window.electronAPI.setUploadPath(file);
    }
</script>

<form>
    <input type="file" id="myFile" name="filename" bind:value={file}>
    <button type="button" on:click|preventDefault={setFileToUpload}>Upload</button>    
</form>