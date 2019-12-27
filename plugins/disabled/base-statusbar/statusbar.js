'use strict';

export class Statusbar {
  constructor() {
    engine.on('start', () => this.init());
  }

  init() {
    // TODO: remove, this should be a function of the renderer
    this.element = ((element) => {
      element.id = 'statusbar';
      element.innerHTML = '<div class="status"><ul><li class="year"></li></ul></div><div class="unit"></div>';
      element.style.position = 'absolute';
      element.style.top = '0px';
      element.style.left = '0px';
      element.style.zIndex = '2';
      element.style.width = '125px';
      element.style.height = '100%';
      element.width = '125px';
      element.height = window.innerHeight;
      element.style.background = 'rgba(222,222,222,.5)';

      return element;
    })(document.createElement('aside'));

    document.body.appendChild(this.element);

    engine.on('statusbar-update', () => this.update());
    engine.on('turn-over', () => engine.emit('statusbar-update'));
    engine.on('turn-start', () => engine.emit('statusbar-update'));
    engine.on('unit-activate', () => engine.emit('statusbar-update'));
    engine.on('unit-activate-next', () => engine.emit('statusbar-update'));
    engine.on('unit-destroyed', () => engine.emit('statusbar-update'));
    engine.on('unit-moved', () => engine.emit('statusbar-update'));
  }

  update() {
    // statusbar.getData();
    this.element.querySelector('.year').innerHTML = `${Math.abs(engine.year)} ${['BC','AD'][engine.year < 0 ? 0 : 1]}`;
    this.element.querySelector('.year').title = `Turn ${engine.turn}`;

    if (engine.currentPlayer) {
      const player = engine.currentPlayer;

      if (player.activeUnit) {
        const unit = player.activeUnit;

        this.element.querySelector('.unit').innerHTML = `<ul><li>${player.people} ${unit.title}</li><li>${unit.movesLeft} moves remaining</li></ul>`;
      }
      else {
        // console.log('No activeUnit', player);
      }
    }
    else {
      // console.log('No currentPlayer', engine);
    }
  }
}

// TODO: use Engine.defineProperty or something
// engine.statusbar = new Statusbar();
