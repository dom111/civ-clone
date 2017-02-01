'use strict';

extend(engine, {
    Civilizations: []
});

Engine.Plugin.get('civilization').forEach(function(component) {
    component.contents.forEach(function(assetPath) {
        engine.Civilizations.push(engine.loadJSON(assetPath));
    });
});
