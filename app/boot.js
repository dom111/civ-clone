'use strict';

const electron = require('electron');
const app = electron.app;
const Menu = require('./lib/Menu');

app.on('window-all-closed', app.quit);
app.on('ready', function() {
    Menu.main();
});
