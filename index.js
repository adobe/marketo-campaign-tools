const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const os = require('os');
const fs = require('fs/promises');
const { open, write, constants } = require('fs');

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
            }).catch(err => console.log(err))
    } else {
        console.log(`Local configuration file method was called without a configuration`);
    }
}

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    // TODO: Check for existence of local user configuration for the application
    // TODO: If local user config, check for use of provided Marketo configuration and auto-load on start-up

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