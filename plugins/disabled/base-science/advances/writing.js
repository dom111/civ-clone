(() => {
    'use strict';

    extend(engine.Science.Advance, {
        Writing: class Writing extends engine.Science.Advance {}
    });

    // TODO: maybe break this data out inso JSON files that are loaded when this plugin is loaded. Feels a bit long-winded...
    extend(engine.Science.Advance.Writing, {
        data: Object.freeze({
            name: 'writing',
            title: t.writing,
            cost: 20,
            requires: ['alphabet']
        })
    });

    extend(engine.Science.advances, {
        writing: engine.Science.Advance.Writing
    });
})();
