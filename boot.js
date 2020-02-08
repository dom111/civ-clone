'use strict';
require = require("esm")(module);
const {Engine} = require('civ-clone/src/Engine.js');
const electron = require('electron');
const app = electron.app;
const path = require('path');
const {promises: fs} = require('fs');

electron.protocol.registerSchemesAsPrivileged([
  {
    scheme: 'app',
    privileges: {
      standard: true,
      secure: true,
    },
  },
]);

app.on('window-all-closed', () => {
  // TODO: possible auto-save before quitting
  app.quit(); // Yes, even on Mac OS X...
});

app.on('ready', () => {
  electron.protocol.registerBufferProtocol('app', (request, onLoad) => {
    const [extension] = request.url.match(/(?<=\.)(js|html|mustache|png|css)/);

    let fileToRead = request.url.replace(/^app:\/\//, '');

    if (fileToRead.match(/node_modules|plugins/)) {
      fileToRead = fileToRead.replace(/^.+(?=node_modules|plugins)/, '');
    }

    fs.readFile(
      path.join(__dirname, fileToRead),
      )
      .catch((err) => console.error(err))
      .then((value) => onLoad({
        mimeType: ({
          js: 'text/javascript',
          html: 'text/html',
          mustache: 'text/html',
          png: 'image/png',
          css: 'text/css',
        })[extension],
        data: value,
      }))
    ;
  });

  const MainWindow = new electron.BrowserWindow({
    title: `civ-one`,
    webPreferences: {
      devTools: global.debug,
      offscreen: true,
    },
  });

  const engine = new Engine();

  engine.start();

  // TODO: all the events?
  [
    'engine:start',
    'player:turn-start'
  ]
    .forEach((event) => {
      engine.on(event, (...args) => {
        MainWindow.webContents.send(event, ...args);
      });
    })
  ;

  MainWindow.loadURL(`app://views/main/html/index.html`);
  MainWindow.webContents.openDevTools();
});
