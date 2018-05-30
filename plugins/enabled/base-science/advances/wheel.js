(() => {
    'use strict';

    extend(engine.Science.Advance, {
        Wheel: class Wheel extends engine.Science.Advance {}
    });

    extend(engine.Science.Advance.Wheel, {
        data: Object.freeze({
            name: 'wheel',
            title: t.the_wheel,
            cost: 50,
            requires: []
        })
    });

    extend(engine.Science.advances, {
        wheel: engine.Science.Advance.Wheel
    });
})();
