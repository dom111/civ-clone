'use strict';

const electron = require('electron');
const app = electron.app;
const ipc = electron.ipcMain;

// commandline argument
global.debug = true;

// ipc listeners
ipc.on('app.getPath', function(event, name) {
    event.returnValue = app.getPath(name);
});

ipc.on('app.getLocale', function(event) {
    event.returnValue = app.getLocale();
});

app.on('window-all-closed', () => {
    // TODO: possible auto-save before quitting
    app.quit(); // Yes, even on Mac OS X...
});

app.on('ready', () => {
    global.MainWindow = new electron.BrowserWindow({
        title: `civ-one`,
        webPreferences: {
            devTools: global.debug,
            offscreen: true
        }
    });

    MainWindow.loadURL(`file:///${__dirname}/views/main/html/index.html?debug=${global.debug}`);

    if (global.debug) {
        MainWindow.webContents.openDevTools();
    }
});
