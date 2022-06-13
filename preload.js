const { contextBridge, ipcRenderer } = require('electron');

ipcRenderer.on(`configuration-loaded`, (e, conf) => {
    config = conf;
    campaignName = conf.CampaignDetails?.name || '';
})

contextBridge.exposeInMainWorld('eapi', {
    getConfig: () => ipcRenderer.invoke('load-configuration'),
    updateConfig: (conf) => ipcRenderer.invoke('configuration-updated', conf), 
    sortConfig: (c) => {
        c.CampaignDetails.Inputs = Object.fromEntries(Object.entries(c.CampaignDetails.Inputs).sort(([,a],[,b]) => a.index - b.index))
    },
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
    exportEntries: () => ipcRenderer.invoke('create-url-exports', config.UrlBuilder.entries, config.CampaignDetails.name),
    exportConfig: () => ipcRenderer.invoke('create-config-export')
});