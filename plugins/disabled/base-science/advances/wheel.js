(() => {
  'use strict';

  Object.defineProperties(engine.Science.Advance, {
    Wheel: class Wheel extends engine.Science.Advance {}
  });

  Object.defineProperties(engine.Science.Advance.Wheel, {
    data: Object.freeze({
      name: 'wheel',
      title: t.the_wheel,
      cost: 50,
      requires: []
    })
  });

  Object.defineProperties(engine.Science.advances, {
    wheel: engine.Science.Advance.Wheel
  });
})();
