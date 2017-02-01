const Util = require('./Util');

module.exports = (function() {
    return {
        // main init
        main: function() {
            var menu = Util.createWindow({
                title: 'CivOne - ' + Util.translate('main_menu'),
                path: '/main-menu/html/index.html'
            });

            return menu;
        }
    }
})();
