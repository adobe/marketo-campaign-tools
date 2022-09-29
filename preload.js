/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('eapi', {
    getConfig: () => ipcRenderer.invoke('load-configuration'),
    updateConfig: (conf) => ipcRenderer.invoke('configuration-updated', conf), 
    setUploadPath: (fileName, path) => ipcRenderer.invoke('set-file-upload', fileName, path),
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
