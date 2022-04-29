const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const os = require('os');
const fs = require('fs/promises');
const { open, write, constants } = require('fs');

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

const updateConfiguration = (config) => {
    if (config !== undefined) {
        console.dir(config);
        let toolkitConfigPath = config.configurationPath;

        fs.writeFile(toolkitConfigPath, JSON.stringify(config), 'utf-8')
            .then(() => { console.log ("File successfully written")})
            .catch((err) => { console.log(err); })
    } else {
        console.log(`Local configuration file method was called without a configuration`);
    }
}

const openUserConfig = () => {
    const { O_RDONLY } = constants;

    return fs.readFile(userConfigPath, 'utf-8');
}

const createWindow = () => {

    const { screen } = require('electron');
    const display = screen.getPrimaryDisplay();
    const { width, height } = display.workAreaSize;

    const mainWindow = new BrowserWindow({
        width: parseInt(width * 0.7),
        height: parseInt(height * 0.6),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    openUserConfig().then(contents => {
        let conf = JSON.parse(contents);
        fs.open(conf.configPath).then(fh => {
            fh.readFile("utf-8")
                .then(contents => {
                    let contentsJson = JSON.parse(contents);
                    Object.assign(contentsJson, {
                        "userConfigPath" : userConfigPath, 
                        "configurationPath" : conf.configPath
                    });
                    console.log(contentsJson);
                    mainWindow.webContents.send('configuration-loaded',contentsJson);            
                })
                .finally(() => {
                    fh.close();
                })
        }).catch(err => {
            mainWindow.webContents.send('no-configuration-found', {});
        })
    })


    ipcMain.on('set-file-upload', (e, fileName, path) => {
        
        console.log(`File to upload would be ${path} with name ${fileName}`);
        createLocalConfig({configPath: path, updated: new Date()});

        fs.open(path).then(fh => {
            fh.readFile("utf-8")
                .then(contents => {
                    let conf = JSON.parse(contents);
                    console.log(`Setting configuration to ${JSON.stringify(conf, 2)}`);
                    e.reply(`configuration-loaded`, conf);
                })
                .finally(() => {
                    fh.close();
                })
        })
        .catch((err) => {
            console.error(`Error while attempting to open ${path}`);
            console.error(err);
        })
    })

    ipcMain.on('configuration-updated', (e, conf) => {
        updateConfiguration(conf);
    })
    
    mainWindow.loadFile(path.join(__dirname, "public/index.html"));
};

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
})