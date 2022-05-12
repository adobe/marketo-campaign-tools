const { contextBridge, ipcRenderer } = require('electron');

const getFromLocal = (key, defaultVal) => {
    let val = localStorage.getItem(key);
    if (val !== undefined) {
        switch(typeof defaultVal) {
            case 'string':
                return val;
            case 'object':
                return JSON.parse(val);
            case 'number':
                return parseInt(val);
            default:
                return val;
        }
    } else {
        return defaultVal;
    }
}

// TODO: This is empty on reload (cmd+r). Figure out how to fix that problem

ipcRenderer.on(`configuration-loaded`, (e, conf) => {
    config = conf;
    campaignName = conf.CampaignDetails?.name || '';
})

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
    exportEntries: () => ipcRenderer.invoke('create-url-exports', config.UrlBuilder.entries, config.CampaignDetails.name)
});