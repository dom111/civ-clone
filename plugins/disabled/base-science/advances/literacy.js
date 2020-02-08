'use strict';

extend(engine.Science.Advance, {
    Literacy: class Literacy extends engine.Science.Advance {}
});

// TODO: maybe break this data out inso JSON files that are loaded when this plugin is loaded. Feels a bit long-winded...
extend(engine.Science.Advance.Literacy, {
    data: Object.freeze({
        name: 'literacy',
        title: 'Literacy',
        cost: 50,
        requires: ['code-of-laws', 'writing']
    })
});

extend(engine.Science.advances, {
    literacy: engine.Science.Advance.Literacy
});
