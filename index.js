const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const os = require('os');
const fs = require('fs/promises');
const { constants, createWriteStream } = require('fs');
const { format } = require('@fast-csv/format');

let userConfigPath = path.join(os.homedir(),".marketo-toolkit");

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

    let toolkitConfigPath = config.configurationPath;
    let err = await fs.writeFile(toolkitConfigPath, JSON.stringify(config), 'utf-8');
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
   

const openUserConfig = () => {
    const { O_RDONLY } = constants;

    return fs.readFile(userConfigPath, 'utf-8');
}

// TODO: Test this against empty configruations (local user and toolkit level)
const loadConfiguration = async (func) => {
    let contents = await openUserConfig();
    let conf = JSON.parse(contents);
    let fh = await fs.open(conf.configPath);
    let fileContents = await fh.readFile("utf-8"); 

    let configJson = JSON.parse(fileContents);
    Object.assign(configJson, 
        {
            "userConfigPath" : userConfigPath, 
            "configurationPath" : conf.configPath
        }
    );
    func(configJson);
    fh.close();
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
    
    // TODO: Remove after dev (or make optional via arg)
    mainWindow.webContents.openDevTools()
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

// http.get('/exports')

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
})