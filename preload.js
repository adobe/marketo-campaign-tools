const { contextBridge, ipcRenderer } = require('electron');

let config = {};

ipcRenderer.on(`configuration-loaded`, (e, conf) => {
    // TODO: Remove statement once ready
    console.log(`Setting the configuration based on the response of ${JSON.stringify(conf)}`);
    config = conf;
})

contextBridge.exposeInMainWorld('electronAPI', {
    getConfig: () => { console.log(`Here's the web configuration: ${JSON.stringify(config, 2)}`); return config}, 
    setUploadPath: (fileName, path) => ipcRenderer.send('set-file-upload', fileName, path, config)
});