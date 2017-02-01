'use strict';

const electron = require('electron');
const app = electron.app;
const ipc = electron.ipcMain;

// ipc listeners
ipc.on('app.getPath', function(event, name) {
    event.returnValue = app.getPath(name);
});

ipc.on('app.getLocale', function(event) {
    event.returnValue = app.getLocale();
});

app.on('window-all-closed', app.quit); // Yes, even on Mac OS X...
app.on('ready', () => {
    global.MainWindow = new electron.BrowserWindow({
        title: `civ-clone`
    });

    MainWindow.loadURL(`file:///${__dirname}/views/main/html/index.html`);

    // commandline argument debug?
    if (true) {
        MainWindow.webContents.openDevTools();
    }
});
