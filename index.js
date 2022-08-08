const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const os = require('os');
const fs = require('fs/promises');
const { constants, createWriteStream } = require('fs');
const { format } = require('@fast-csv/format');
const DefaultConfig = require('./defaultConfig');

// Specific bit of code to handle squirrel startup on Windows
if(require('electron-squirrel-startup')) return;

let userConfigPath = path.join(os.homedir(),".marketo-toolkit");
let configPath;

const createLocalConfig = (config) => {
    
    const { O_RDWR, O_CREAT } = constants;
    
    if (config !== undefined) {
        
        let userConfigPath = path.join(os.homedir(),".marketo-toolkit");

        // If file exists, grab existing configuration
        fs.open(userConfigPath, O_RDWR | O_CREAT)
            .then(fh => {
                fh.readFile("utf-8")
                    .then(contents => {
                        console.log(`******\n${contents}\n******`);
                        let text = contents ? contents : "{}";
                        let fileConfiguration = JSON.parse(text);
                        Object.assign(fileConfiguration, config);

                        fs.writeFile(userConfigPath, JSON.stringify(fileConfiguration), 'utf-8', (err, data) => {
                            if (err) console.log(err);
                        })
                    })
                    .catch(err => { console.log(err) })
                    .finally(() => fh.close() );
            })
            .catch(err => console.log(err))
    } else {
        console.log(`Local configuration file method was called without a configuration`);
    }
}

const updateConfiguration = async (config) => { 
   
    if (config === undefined) {
        console.log(`Local configuration file method was called without a configuration`);
    }

    sortConfigInputs(config);

    let err = await fs.writeFile(config.configPath, JSON.stringify(config), 'utf-8');
    if (err !== undefined) {
        console.error(err);
        return false;
    } else {
        return true;
    }
}

const sortConfigInputs = (config) => {
    config.CampaignDetails.Inputs = Object.fromEntries(Object.entries(config.CampaignDetails.Inputs).sort(([,a],[,b]) => a.index - b.index))
}
   

const openUserSettings = async (asJson = false) => {
    let contents = await fs.readFile(userConfigPath, 'utf-8')
    return asJson === true ? JSON.parse(contents) : contents;
}

const getConfiguration = async(asJson = false) => {
    let conf = await openUserSettings(true); 
    // This is set at application level
    configPath = conf.configPath;
    let fh = await fs.open(conf.configPath);
    let fileContents = await fh.readFile("utf-8"); 
    fh.close();

    return asJson ? JSON.parse(fileContents) : fileContents;
}

const loadConfiguration = async (fn) => {

    let configJson;
    let exists = true;

    try {
        configJson = await getConfiguration(true);
    } catch (err) {
        console.log(`Error while attempting to retrieve configuration, creating default`);
        configJson = DefaultConfig;
        configPath = path.join(os.homedir(),".marketo-toolkit-configuration");
        exists = false;
    }

    Object.assign(configJson, 
        {
            "userConfigPath" : userConfigPath, 
            "configPath" : configPath
        }
    );

    if (!exists) {
        createLocalConfig({
            "userConfigPath" : userConfigPath, 
            "configPath" : configPath
        });
        updateConfiguration(configJson);
    }

    fn(configJson);
}

const createUrlExportsFile = async (filePath, config) => {

    return new Promise((resolve, reject) => {
        console.log("attempting to create file");
        try {
            let exportFile = createWriteStream(filePath);
            const stream = format({headers: true });
            stream.pipe(exportFile);
            console.dir(config.UrlBuilder);
            Object.values(config.UrlBuilder.entries).forEach((entry) => {
                let row = {}
                row.campaignName = config.CampaignDetails.name;
                Object.assign(row, entry.values);
                row.url = entry.url;
            
                stream.write(row);
            });
            stream.end(undefined, undefined, () => {
                resolve(filePath);
            });
        } catch (err) {
            console.log(`%cError while attempting to create exports`, "color: #f00");
            console.log(err);
            reject(err);
        }
    })
}

const createConfigFile = async (filePath, config) => {
    return new Promise((resolve, reject) => {
        try {
            let exported = createWriteStream(filePath);
            exported.write(JSON.stringify(config));
            exported.end(undefined, undefined, () => {
                resolve(filePath);
            });
        } catch (err) { 
            reject(err);
        }
    })
}

const createWindow = () => {

    const { screen } = require('electron');
    const display = screen.getPrimaryDisplay();
    const { width, height } = display.workAreaSize;

    const mainWindow = new BrowserWindow({
        width: parseInt(width * 0.7),
        height: parseInt(height * 0.8),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });
    
    mainWindow.loadFile(path.join(__dirname, "public/index.html"));

    ipcMain.handle('save-file', async (e, item) => {

        let config = await getConfiguration(true);

        return new Promise((resolve, reject) => {

            let status = {};
    
            let saveOpts = { 
                title: "Save File", 
                defaultPath: item === "entries" ? `url-exports.csv` : `${config.CampaignDetails.name}.json`, 
                filters: { extensions: ['csv'] } 
            }
            try { 
                dialog.showSaveDialog(mainWindow, saveOpts)
                    .then(result => {
                        if (result.canceled) {
                            status.cancelled = true;
                            resolve(status);
                        }
        
                        let fn;
                        switch (item) {
                            case 'entries': 
                                fn = createUrlExportsFile;
                                break;
                            case 'config':
                                fn = createConfigFile;
                                break;
                        }
                        fn(result.filePath, config)
                            .then(filePath => {
                                status.path = filePath;
                                status.status = "success";
                                resolve(status)
                            })
                            .catch(err => reject(err));
                    })
                    .catch(err => reject(err));
            }
            catch (err) {
                reject(err);
            }
        })
    })
};

ipcMain.handle('configuration-updated', async (e, conf) => {
    return await updateConfiguration(conf);
});

ipcMain.handle('load-configuration', async(e) => {
    let conf; 
    await loadConfiguration((contents) => { conf = contents });
    return conf;
})

ipcMain.handle('set-file-upload', async (e, fileName, path) => {
    return new Promise((resolve, reject) => {
        console.log(`File to upload would be ${path} with name ${fileName}`);
        createLocalConfig({configPath: path, updated: new Date()});

        fs.open(path).then(fh => {
            fh.readFile("utf-8")
                .then(contents => {
                    let conf = JSON.parse(contents);
                    console.log(`Setting configuration to ${JSON.stringify(conf, 2)}`);
                    resolve(conf);
                })
                .catch((err) => { 
                    console.error(err);
                    reject(err) 
                })
                .finally(() => {
                    fh.close();
                })
        })
        .catch((err) => {
            console.error(`Error while attempting to open ${path}`);
            reject(err);
        })
    })
});

ipcMain.handle('create-url-exports', async (e, entries, campaignName) => {
    return createUrlExportsFile(path.join(os.tmpdir(), "url-exports.csv"));
})

ipcMain.handle('create-config-export', async () => {
    return configPath;
})

ipcMain.handle('reset-configuration', async () => {
    let conf = await openUserSettings(true);
    return new Promise((resolve, reject) => {
        fs.unlink(conf.configPath)
            .then(() => {
                fs.unlink(conf.userConfigPath)
                    .then(() => {
                        loadConfiguration((configuration) => resolve(configuration));
                    })
                    .catch(err => reject(err))
            })
            .catch(err => reject(err))
    })
})

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
})