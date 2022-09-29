<!--
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
-->
<script>
    import { saveFile } from '../../lib/utils';

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
            <button class="download" disabled={!files} type="button" on:click|preventDefault={() => saveFile("config")}>Download</button>    
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