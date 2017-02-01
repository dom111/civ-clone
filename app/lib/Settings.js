const fs = require('fs');
const settingsFile = __dirname + '/../../settings.json';
var settings = {};

module.exports = (function() {
    var _load = function() {
        try {
            fs.accessSync(settingsFile);

            settings = JSON.parse(fs.readFileSync(settingsFile), 'utf8');
        }
        catch (e) {
            console.error('Error loading settings: ' + e);
            // defaults
            settings = {
                language: "en"
            };

            _save();
        }
    },
    _save = function() {
        return fs.writeFileSync(settingsFile, JSON.stringify(settings), 'utf8');
    };

    _load();

    return {
        // main init
        get: function(key, value) {
            return settings[key] || value;
        },
        set: function(key, value) {
            settings[key] = value;
            _save();

            return true;
        }
    }
})();
