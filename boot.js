'use strict';

const electron = require('electron');
global.app = electron.app;
global.Plugin = require('./lib/plugin');

Plugin.load(); // processes all enabled plugins before initialising the game object
// TODO: move the above into Game::constructor

global.Game = require('./lib/game');
global.View = require('./lib/view');

app.on('window-all-closed', app.quit);
app.on('ready', () => {
    Game.menu.main();
});
