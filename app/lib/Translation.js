const Settings = require('./Settings');
const fs = require('fs');
const translationPath = __dirname + '/../translations/';
var translations = {};

module.exports = (function() {
    var _load = function(language) {
        var path = translationPath + language + '.json';

        try {
            fs.accessSync(path);
            translations = JSON.parse(fs.readFileSync(path), 'utf8');
        }
        catch (e) {
            console.error("Translation error: " + e);
        }
    };

    _load(Settings.get('language', 'en'));

    return {
        get: function(key) {
            return key in translations ? translations[key] : 'Missing key: ' + key;
        },
        getAll: function() {
            return translations;
        }
    }
})();
