'use strict';




extend(engine.Science.Advance, {
    Alphabet: class Alphabet extends engine.Science.Advance {}
});

// TODO: maybe break this data out inso JSON files that are loaded when this plugin is loaded. Feels a bit long-winded...
extend(engine.Science.Advance.Alphabet, {
    data: Object.freeze({
        name: 'alphabet',
        title: 'Alphabet',
        cost: 10,
        requires: []
    })
});

extend(engine.Science.advances, {
    alphabet: engine.Science.Advance.Alphabet
});

const name = 'settlers';


extend(engine.Unit, {
    Settlers: class Settlers extends engine.Unit {
        buildCity() {
            var unit = this;

            new engine.City({
                player: unit.player,
                tile: unit.tile,
                name: unit.player.cityNames.shift() // TODO: input box/confirmation
            });

            unit.destroy();
        }

        irrigate() {
            var unit = this;


            if (!unit.tile.improvements.includes('irrigation') && unit.tile.terrain.improvements.irrigation && (Object.keys(unit.tile.adjacent).map((direction) => unit.tile.adjacent[direction]).filter((tile) => tile.terrain.name === 'river' || (tile.improvements.includes('irrigation') && !tile.city) || tile.terrain.ocean).length || unit.tile.terrain.name === 'river')) {
                // unit.status = action.key;
                unit.status = 'i';
                // TODO: terrain modifier
                // unit.busy = action.turns;
                unit.busy = 2;
                unit.movesLeft = 0;
                unit.currentAction = action;
            }
            else {
                // TODO: alert, no access to water, etc
            }
        }
    }
});

// TODO: maybe break this data out inso JSON files that are loaded when this plugin is loaded. Feels a bit long-winded...
extend(engine.Unit.Settlers, {
    data: {
        name,
        title: "Settlers",
        cost: 40,
        attack: 0,
        defence: 1,
        movement: 1,
        visibility: 1,
        land: true
    }
});

// TODO: addProperty method that checks existence?
engine.Unit.available[name] = engine.Unit.Settlers;

extend(engine.Unit, {
    availableActions: {
        // TODO: break this out into something else, so it can be used by a worker too?
        // Duplication seems pretty stupid, especially with the run/complete 
        // buildCity: {
        //     name: 'buildCity',
        //     title: 'Build city',
        //     turns: 0,
        //     run: (unit, action) => {
        //         new engine.City({
        //             player: unit.player,
        //             tile: unit.tile,
        //             name: unit.player.cityNames.shift() // TODO: input box/confirmation
        //         });

        //         unit.destroy();
        //     }
        // },
        irrigate: {
            name: 'irrigate',
            title: 'Build irrigation',
            turns: 2,
            key: 'i',
            availableTo: {
                include: ['settlers']
            },
            run: (unit, action) => {
                if (!unit.tile.improvements.includes('irrigation') && unit.tile.terrain.improvements.irrigation && (Object.keys(unit.tile.adjacent).map((direction) => unit.tile.adjacent[direction]).filter((tile) => tile.terrain.name === 'river' || (tile.improvements.includes('irrigation') && !tile.city) || tile.terrain.ocean).length || unit.tile.terrain.name === 'river')) {
                    unit.status = action.key;
                    // TODO: terrain modifier
                    unit.busy = action.turns;
                    unit.movesLeft = 0;
                    unit.currentAction = action;
                }
                else {
                    // TODO: alert, no access to water, etc
                }
            },
            complete: (unit) => {
                unit.currentAction = unit.busy = false;
                engine.emit('tile-improvement-built', unit.tile, 'irrigation');
            }
        },
        road: {
            name: 'road',
            title: 'Build road',
            turns: 1,
            key: 'r',
            availableTo: {
                include: ['settlers']
            },
            run: (unit, action) => {
                if (!unit.tile.improvements.includes('road') && unit.tile.terrain.improvements.road) {
                    unit.status = action.key;
                    // TODO: terrain modifier
                    unit.busy = action.turns;
                    unit.movesLeft = 0;
                    unit.currentAction = action;
                }
            },
            complete: (unit) => {
                unit.currentAction = unit.busy = false;
                engine.emit('tile-improvement-built', unit.tile, 'road');
            }
        },
        mine: {
            name: 'mine',
            title: 'Build mine',
            turns: 3,
            key: 'm',
            availableTo: {
                include: ['settlers']
            },
            run: (unit, action) => {
                if (!unit.tile.improvements.includes('mine') && unit.tile.terrain.improvements.mine) {
                    unit.status = action.key;
                    // TODO: terrain modifier
                    unit.busy = action.turns;
                    unit.movesLeft = 0;
                    unit.currentAction = action;
                }
            },
            complete: (unit) => {
                unit.currentAction = unit.busy = false;
                engine.emit('tile-improvement-built', unit.tile, 'mine');
            }
        }
    }
});
