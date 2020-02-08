'use strict';

extend(engine.Science.Advance, {
    Mathematics: class Mathematics extends engine.Science.Advance {}
});

// TODO: maybe break this data out inso JSON files that are loaded when this plugin is loaded. Feels a bit long-winded...
extend(engine.Science.Advance.Mathematics, {
    data: {
        name: 'mathematics',
        title: 'Mathematics',
        cost: 20,
        requires: ['alphabet', 'masonry']
    }
});

extend(engine.Science.advances, {
    mathematics: engine.Science.Advance.Mathematics
});
