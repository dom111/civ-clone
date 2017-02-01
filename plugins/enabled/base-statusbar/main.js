'use strict';

var Statusbar = global.Statusbar = class Statusbar {
    init() {
        var statusbar = this;

        this.element = (function(element) {
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

        game.on('statusbar-update', () => statusbar.update());
        game.on('turn-over', () => game.emit('statusbar-update'));
        game.on('turn-start', () => game.emit('statusbar-update'));
        game.on('unit-activate', () => game.emit('statusbar-update'));
        game.on('unit-activate-next', () => game.emit('statusbar-update'));
        game.on('unit-destroyed', () => game.emit('statusbar-update'));
        game.on('unit-moved', () => game.emit('statusbar-update'));
    }

    update() {
        // statusbar.getData();
        this.element.querySelector('.year').innerHTML = Math.abs(game.year) + ' ' + ['BC','AD'][game.year < 0 ? 0 : 1];
        this.element.querySelector('.year').title = 'Turn ' + game.turn;

        if (game.currentPlayer) {
            var player = game.currentPlayer;

            if (player.activeUnit) {
                var unit = player.activeUnit;
                this.element.querySelector('.unit').innerHTML = '<ul><li>' + player.people + ' ' + unit.title + '</li><li>' + unit.movesLeft + ' moves remaining</li></ul>';
            }
            else {
                console.log('No activeUnit', player);
            }
        }
        else {
            console.log('No currentPlayer', game);
        }
    }
};

game.statusbar = new Statusbar();

game.on('start', function() {
    game.statusbar.init();
});
