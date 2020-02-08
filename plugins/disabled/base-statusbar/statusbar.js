'use strict';

var Statusbar = global.Statusbar = class Statusbar {
    init() {
        var statusbar = this;

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

        var statusbar = this;

        this.#engine.on('statusbar-update', () => statusbar.update());
        this.#engine.on('turn-over', () => this.#engine.emit('statusbar-update'));
        this.#engine.on('turn-start', () => this.#engine.emit('statusbar-update'));
        this.#engine.on('unit-activate', () => this.#engine.emit('statusbar-update'));
        this.#engine.on('unit-activate-next', () => this.#engine.emit('statusbar-update'));
        this.#engine.on('unit-destroyed', () => this.#engine.emit('statusbar-update'));
        this.#engine.on('unit-moved', () => this.#engine.emit('statusbar-update'));
    }

    update() {
        // statusbar.getData();
        this.element.querySelector('.year').innerHTML = Math.abs(this.#engine.year) + ' ' + ['BC','AD'][this.#engine.year < 0 ? 0 : 1];
        this.element.querySelector('.year').title = 'Turn ' + this.#engine.turn;

        if (this.#engine.currentPlayer) {
            var player = this.#engine.currentPlayer;

            if (player.activeUnit) {
                var unit = player.activeUnit;
                this.element.querySelector('.unit').innerHTML = '<ul><li>' + player.people + ' ' + unit.title + '</li><li>' + unit.movesLeft + ' moves remaining</li></ul>';
            }
            else {
                // console.log('No activeUnit', player);
            }
        }
        else {
            // console.log('No currentPlayer', this.#engine);
        }
    }
};

engine.statusbar = new Statusbar();

engine.on('start', () => engine.statusbar.init());
