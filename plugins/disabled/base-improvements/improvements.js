'use strict';

extend(engine.City, {
    'Improvement': class Improvement {
        constructor(city) {
            var improvement = this;
            city.improvements.push(improvement);

            extend(improvement, {
                city: city
            }, improvement.constructor.data);
        }

        static get(improvement) {
            return engine.City.improvements[improvement];
        }

        // TODO: maybe this should be done as part of the 'advance-discovered' event instead...
        static getAvailable(player) {
            return Object.keys(engine.City.improvements).filter((improvement) => {
                return (!engine.City.improvements[improvement].requires) || player.advances.includes(engine.City.improvements[improvement].requires);
            }).map((improvement) => {
                return engine.City.improvements[improvement];
            });
        }
    }
});

extend(engine.City, {
    'improvements': {}
});
