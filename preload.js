const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('eapi', {
    getConfig: () => ipcRenderer.invoke('load-configuration'),
    updateConfig: (conf) => ipcRenderer.invoke('configuration-updated', conf), 
    setUploadPath: (fileName, path) => ipcRenderer.invoke('set-file-upload', fileName, path, config),
    entries: (entries) => {
        if (entries) {
            config.UrlBuilder = config.UrlBuilder || {};
            config.UrlBuilder.entries = entries;
            ipcRenderer.send('configuration-updated', config);
        } else {
            return conf.UrlBuilder?.entries || {};
        }
    }, 
    reset: () => ipcRenderer.invoke('reset-configuration'),
    saveFile: (item) => ipcRenderer.invoke('save-file', item)
});
