'use strict';

extend(engine.City.Improvement, {
    Granary: class Granary extends engine.City.Improvement {}
});

// TODO: maybe break this data out inso JSON files that are loaded when this plugin is loaded. Feels a bit long-winded...
extend(engine.City.Improvement.Granary, {
    data: {
        name: 'granary',
        title: 'Granary',
        cost: 60,
        requires: 'pottery'
    }
});

extend(engine.City.improvements, {
    granary: engine.City.Improvement.Granary
});

engine.on('city-grow', (city) => {
    if (city && city.improvements.filter((improvement) => improvement.name === 'granary').length) {
        city.foodStorage >= Math.floor(((city.size * 10) + 10) / 2);
    }
});
