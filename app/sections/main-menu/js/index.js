var Util = require('../../../lib/Util');

Util.template('/main-menu/mustache/menu.mustache', function(template) {
    document.querySelector('#main-menu').innerHTML = template;

    document.querySelector('#main-menu a.start-new-game').addEventListener('click', function(event) {
        event.preventDefault();

        console.log('start-new-game clicked.');
    });
});
