const { app, BrowserWindow, ipcMain } = require('electron');
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

// TODO: Let this logic be on the client-side
const sortConfigInputs = (config) => {
    config.CampaignDetails.Inputs = Object.fromEntries(Object.entries(config.CampaignDetails.Inputs).sort(([,a],[,b]) => a.index - b.index))
}
   

const openUserConfig = () => {
    return fs.readFile(userConfigPath, 'utf-8');
}

// TODO: Test this against empty configruations (local user and toolkit level)
const loadConfiguration = async (fn) => {

    let configJson;
    let exists = true;

    try {
        let contents = await openUserConfig(); 
        let conf = JSON.parse(contents);
        configPath = conf.configPath;
        let fh = await fs.open(conf.configPath);
        let fileContents = await fh.readFile("utf-8"); 
        configJson = JSON.parse(fileContents);
        fh.close();
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

    loadConfiguration((contentsJson) => {mainWindow.webContents.send('configuration-loaded',contentsJson)});
    
    mainWindow.loadFile(path.join(__dirname, "public/index.html"));
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

    console.log(`File to upload would be ${path} with name ${fileName}`);
    createLocalConfig({configPath: path, updated: new Date()});

    fs.open(path).then(fh => {
        fh.readFile("utf-8")
            .then(contents => {
                let conf = JSON.parse(contents);
                console.log(`Setting configuration to ${JSON.stringify(conf, 2)}`);
                return conf;
            })
            .catch((err) => { 
                console.error(err);
                return {}; 
            })
            .finally(() => {
                fh.close();
            })
    })
    .catch((err) => {
        console.error(`Error while attempting to open ${path}`);
        reject(err);
    })
});

ipcMain.handle('create-url-exports', async (e, entries, campaignName) => {
    let filePath = path.join(os.tmpdir(), 'excel-exports.csv')
    let exportFile = createWriteStream(filePath);
    const stream = format({headers: true });
    stream.pipe(exportFile);
    Object.values(entries).forEach((entry) => {
        let row = {}
        row.campaignName = campaignName;
        Object.assign(row, entry.values);
        row.url = entry.url;
    
        stream.write(row);
    });
    stream.end();
    return filePath;
})

ipcMain.handle('create-config-export', async () => {
    return configPath;
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