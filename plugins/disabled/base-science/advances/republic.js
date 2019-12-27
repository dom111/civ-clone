'use strict';

Object.defineProperties(engine.Science.Advance, {
  Republic: class 
  Republic extends engine.Science.Advance {}
});

// TODO: maybe break this data out inso JSON files that are loaded when this plugin is loaded. Feels a bit long-winded...
Object.defineProperties(engine.Science.Advance.Republic, {
  data: Object.freeze({
    name: 'republic',
    title: 'The Republic',
    cost: 50,
    requires: ['code-of-laws', 'literacy']
  })
});

Object.defineProperties(engine.Science.advances, {
  republic: engine.Science.Advance.Republic
});
