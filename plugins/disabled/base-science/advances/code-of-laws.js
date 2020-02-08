'use strict';

extend(engine.Science.Advance, {
    CodeOfLaws: class CodeOfLaws extends engine.Science.Advance {}
});

// TODO: maybe break this data out inso JSON files that are loaded when this plugin is loaded. Feels a bit long-winded...
extend(engine.Science.Advance.CodeOfLaws, {
    data: Object.freeze({
        name: 'codeoflaws',
        title: 'Code of Laws',
        cost: 20,
        requires: ['alphabet']
    })
});

extend(engine.Science.advances, {
    codeoflaws: engine.Science.Advance.CodeOfLaws
});
