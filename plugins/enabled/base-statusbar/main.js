'use strict';

game.on('start', function() {
    document.body.appendChild(
        (function(element) {
            element.id = 'statusbar';
            element.innerHTML = '<ul><li class="year"></li></ul>';
            element.style.position = 'absolute';
            element.style.top = '0px';
            element.style.left = '0px';
            element.style.zIndex = '1';
            element.style.width = '125px';
            element.style.height = '100%';
            element.width = '125px';
            element.height = window.innerHeight;
            element.style.background = 'rgba(222,222,222,.5)';

            return element;
        })(document.createElement('aside'))
    );

    var statusContainer = document.getElementById('statusbar');

    game.on('turn-start', function() {
        statusContainer.querySelector('.year').innerHTML = Math.abs(game.year) + ' ' + ['BC','AD'][game.year < 0 ? 0 : 1];
        statusContainer.querySelector('.year').title = 'Turn ' + game.turn;
    });
});
