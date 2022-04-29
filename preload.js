const { contextBridge, ipcRenderer } = require('electron');

// TODO: This is empty on reload (cmd+r). Figure out how to fix that problem.
let config = {};
let campaignName = '';
let entries = new Map();

ipcRenderer.on(`configuration-loaded`, (e, conf) => {
    config = conf;
    campaignName = conf.CampaignDetails?.name || '';
})

contextBridge.exposeInMainWorld('eapi', {
    getConfig: () => { return config },
    updateConfig: (conf) => { 
        ipcRenderer.send('configuration-updated', conf);
    }, 
    setUploadPath: (fileName, path) => ipcRenderer.send('set-file-upload', fileName, path, config),
    campaignName: (updatedName) => { 
        if (updatedName) {
            console.log(`Updating from ${campaignName} to ${updatedName}`); 
            campaignName = updatedName 
        } 
        return campaignName 
    }, 
    entries: (entries) => {
        if (entries) {
            conf.UrlBuilder = conf.UrlBuilder || {};
            conf.UrlBuilder.Entries = conf.UrlBuilder.Entries || entries;
            
            // update entries
        } else {
            return entries;
        }
    }
});