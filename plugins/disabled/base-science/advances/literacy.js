'use strict';

Object.defineProperties(engine.Science.Advance, {
  Literacy: class Literacy extends engine.Science.Advance {}
});

// TODO: maybe break this data out inso JSON files that are loaded when this plugin is loaded. Feels a bit long-winded...
Object.defineProperties(engine.Science.Advance.Literacy, {
  data: Object.freeze({
    name: 'literacy',
    title: 'Literacy',
    cost: 50,
    requires: ['code-of-laws', 'writing']
  })
});

Object.defineProperties(engine.Science.advances, {
  literacy: engine.Science.Advance.Literacy
});
