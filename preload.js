const { contextBridge, ipcRenderer } = require('electron');

// TODO: This is empty on reload (cmd+r). Figure out how to fix that problem.
let config = {};

ipcRenderer.on(`configuration-loaded`, (e, conf) => {
    // TODO: Remove statement once ready
    console.log(`Setting the configuration based on the response of ${JSON.stringify(conf)}`);
    config = conf;
})

contextBridge.exposeInMainWorld('electronAPI', {
    getConfig: () => { return config }, 
    setUploadPath: (fileName, path) => ipcRenderer.send('set-file-upload', fileName, path, config)
});