'use strict';

Object.defineProperties(engine.Science.Advance, {
  Alphabet: class Alphabet extends engine.Science.Advance {}
});

// TODO: maybe break this data out inso JSON files that are loaded when this plugin is loaded. Feels a bit long-winded...
Object.defineProperties(engine.Science.Advance.Alphabet, {
  data: Object.freeze({
    name: 'alphabet',
    title: 'Alphabet',
    cost: 10,
    requires: []
  })
});

Object.defineProperties(engine.Science.advances, {
  alphabet: engine.Science.Advance.Alphabet
});
