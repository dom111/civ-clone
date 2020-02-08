'use strict';

import BaseRenderer from '/plugins/enabled/base-renderer/renderer.js';
import electron from 'electron';

window.addEventListener('load', () => {
  document.querySelector('#main-menu').innerHTML = engine.template('main/mustache/menu.mustache');

  document.querySelector('#main-menu a.start-new-game').addEventListener('click', () => {
    const renderer = new BaseRenderer(electron.ipcRenderer);

    electron.ipcRenderer.on('engine:start', () => renderer.init());
    electron.ipcRenderer.on('player:turn-start', () => {
      ['visibility', 'activeVisibility'].forEach((layer) => engine.emit('build-layer', layer));
    });
  });
});
