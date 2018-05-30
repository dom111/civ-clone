'use strict';

extend(engine.Science.Advance, {
    Masonry: class Masonry extends engine.Science.Advance {}
});

// TODO: maybe break this data out inso JSON files that are loaded when this plugin is loaded. Feels a bit long-winded...
extend(engine.Science.Advance.Masonry, {
    data: Object.freeze({
        name: 'masonry',
        title: 'Masonry',
        cost: 50,
        requires: []
    })
});

extend(engine.Science.advances, {
    republic: engine.Science.Advance.Masonry
});
