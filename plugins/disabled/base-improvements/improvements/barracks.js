'use strict';

extend(engine.City.Improvement, {
    Barracks: class Barracks extends engine.City.Improvement {}
});

// TODO: maybe break this data out inso JSON files that are loaded when this plugin is loaded. Feels a bit long-winded...
extend(engine.City.Improvement.Barracks, {
    data: {
        name: 'barracks',
        title: 'Barracks',
        cost: 40,
        requires: false
    }
});

extend(engine.City.improvements, {
    barracks: engine.City.Improvement.Barracks
});

engine.on('unit-created', (unit) => {
    if (unit.city && unit.city.improvements.filter((improvement) => improvement.name === 'barracks').length) {
        unit.veteran = true;
    }
});
