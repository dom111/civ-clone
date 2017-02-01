'use strict';

(function() {
    var translations = {},
    language,
    country;

    (function _load() {
        // var [language, country] = engine.setting('language').split(/_/); // destructuring not supported yet
        var locale = (engine.setting('language') || 'en').split(/[-_]/);
        language = locale[0],
        country = locale[1];

        // these should already be ordered by weight so we shouldn't need to worry about sorting here...
        Engine.Plugin.get('translation').filter(function(translation) {
            return (
                translation.language === language &&
                (
                    typeof translation.country === 'undefined' ||
                    translation.country === country
                )
            ) || (
                translation.country === country &&
                typeof translation.language === 'undefined'
                // don't need to check same as above, as if above matches, this is unnecessary...
            ) || (
                typeof translation.country === 'undefined' &&
                typeof translation.language === 'undefined'
                // catch-all for non-language dependent keys (could be used for symbols or fallbacks)
            );
        }).forEach(function(translation) {
            translation.contents.forEach(function(file) {
                extend(translations, engine.loadJSON(file));
            });
        });
    })();

    engine.extend({
        Translation: {
            get: function(key) {
                return key in translations ? translations[key] : `${key} [${language}${country ? '_' + country : ''}]`;
            },
            getAll: function() {
                return translations;
            }
        }
    });
})();
