const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    setUploadPath: (file) => ipcRenderer.send('set-file-upload', file)
});