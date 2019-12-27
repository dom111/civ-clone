'use strict';

(function() {
  const translations = {},
    locale = (engine.setting('language') || 'en').split(/[-_]/),
    language = locale[0],
    country = locale[1];

  // these should already be ordered by weight so we shouldn't need to worry about sorting here...
  Engine.Plugin.get('translation').filter((translation) => {
    return (translation.language === language && (typeof translation.country === 'undefined' || translation.country === country)) ||
            // don't need to check same as above, as if above matches, this is unnecessary...
            (translation.country === country && typeof translation.language === 'undefined') ||
            // catch-all for non-language dependent keys (could be used for symbols or fallbacks)
            (typeof translation.country === 'undefined' && typeof translation.language === 'undefined');
  }).forEach((translation) => {
    translation.contents.forEach((file) => {
      Object.defineProperties(translations, engine.loadJSON(file));
    });
  });

  // load for mustache
  Object.defineProperties(engine.templateVars, {
    t: translations
  });

  // so we can use t.<key> the same as we do in mustache
  global.t = translations;
})();
