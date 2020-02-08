'use strict';

// TODO: split this out like improvements - maybe?
extend(engine, {
    Unit: class Unit {
        constructor(details) {
            let unit = this,
            baseUnit = Unit.getByName(details.unit);

            if (!baseUnit) {
                throw `Unknown unit '${details.unit}'.`;
            }

            extend(unit, baseUnit);
            extend(unit, details);
            unit.actions = {};

            unit.player.units.push(unit);

            Object.keys(Unit.availableActions).forEach((actionName) => {
                let action = Unit.availableActions[actionName];

                if (!action.availableTo || ((!action.availableTo.include || (!action.availableTo.include.length || action.availableTo.include.includes(unit.name))) && (!action.availableTo.exclude || (!action.availableTo.exclude.length || !action.availableTo.exclude.includes(unit.name))))) {
                    unit.actions[action.name] = action;
                }
            });

            unit.applyVisibility();

            engine.emit('unit-created', unit);
        }

        applyVisibility() {
            let unit = this;

            for (let x = unit.tile.x - unit.visibility; x <= unit.tile.x + unit.visibility; x++) {
                for (let y = unit.tile.y - unit.visibility; y <= unit.tile.y + unit.visibility; y++) {
                    engine.emit('tile-seen', engine.map.get(x, y), unit.player);
                }
            }

            engine.emit('player-visibility-changed', unit.player);
        }

        // TODO: break this down, so moves can be validated and allow for extension (capturing settlers, barbarian 'leaders' etc)
        validateMove(to) {
            if (!to) {
                return false;
            }

            let unit = this,
            neighbours = unit.tile.neighbours;

            if (unit.movesLeft <= 0.1) {
                return false;
            }

            if (!Object.keys(neighbours).map((position) => neighbours[position]).includes(to)) {
                return false;
            }

            // TODO: exclude cities
            if (to.terrain.ocean && !unit.ocean) {
                return false;
            }

            if (to.terrain.land && !unit.land) {
                // TODO: transportation units
                return false;
            }

            if (to.units.length && to.units[0].player != unit.player) {
                return unit.resolveCombat(to.units);
            }

            if (to.city && to.city.player != unit.player) {
                // TODO: interact
                return false;
            }

            // TODO: adjacency rules

            // TODO
            let movementCost = unit.tile.movementCost(to);

            if (movementCost > unit.movesLeft) {
                if ((Math.random() * 1.5) < (unit.movesLeft / movementCost)) {
                    unit.movesLeft = 0;

                    return false;
                }
            }

            return movementCost;
        }

        move(to) {
            let unit = this,
            from = unit.tile;

            if (['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'].includes(to)) {
                to = unit.tile.neighbours[to];
            }

            let movementCost = unit.validateMove(to);

            if (movementCost !== false) {
                unit.tile.units = unit.tile.units.filter((tileUnit) => tileUnit !== unit);

                unit.tile = to;
                unit.tile.units.push(unit);

                unit.movesLeft -= movementCost;

                if (unit.movesLeft <= 0.1) {
                    unit.movesLeft = 0;
                }

                engine.emit('unit-moved', unit, from, to);
            }
            else {
                console.log("Can't move " + unit.player.people + " " + unit.title + " from " + unit.tile.x + "," + unit.tile.y + " to " + to.x + "," + to.y);
                // play sound
            }
        }

        resolveCombat(units) {
            let unit = this;
            let defender = units.sort((a,b) => a.defence > b.defence ? -1 : a.defence == b.defence ? 0 : 1)[0],

            // TODO: get current combat scheme and use that to resolve
            result = Unit.combat.resolve(this, defender);

            if (result) {
                if (unit.tile.city || unit.tile.improvements.includes('fortress')) {
                    defender.destroy();
                }
                else {
                    defender.tile.units.forEach((unit) => unit.destroy());
                }
            }
            else {
                this.destroy();
            }

            return result;
        }

        action(action) {
            if (this.can(action)) {
                this.actions[action].run(this, this.actions[action]);

                engine.emit('unit-action', this, this.actions[action]);
            }
            else {
                console.log("Can't call action " + action + " on " + this.player.people + " " + this.title);
            }
        }

        can(action) {
            return action in this.actions;
        }

        destroy() {
            if (global.debug) {
                console.log(this.player.people + ' ' + this.name + ' destroyed.');
            }

            engine.emit('unit-destroyed', this);
        }
    }
});

extend(engine.Unit, {
    availableActions: {
        sentry: {
            name: 'sentry',
            title: 'Sentry',
            turns: 0,
            key: 's',
            availableTo: {},
            run: (unit, action) => {
                unit.busy = -1;
                unit.active = false;
                unit.style = {
                    opacity:.5
                };
            }
        },
        fortify: {
            name: 'fortify',
            title: 'Fortify',
            turns: 1,
            run: (unit, action) => {
                unit.busy = -1;
                unit.active = false;
                unit.fortified = true;
            }
        },
        disband: {
            name: 'disband',
            title: 'Disband',
            turns: 0,
            run: (unit, action) => unit.destroy()
        },
        pillage: {
            name: 'pillage',
            title: 'Pillage',
            turns: 1,
            run: (unit, action) => engine.emit('tile-improvement-pillaged', unit.tile, unit.tile.improvements[0])
        },
        noOrders: {
            name: 'noOrders',
            title: 'No orders',
            turns: 0,
            run: (unit, action) => unit.movesLeft = 0
        },

        // TODO: break this out into settlers/workers? 
        buildCity: {
            name: 'buildCity',
            title: 'Build city',
            turns: 0,
            run: (unit, action) => {
                new engine.City({
                    player: unit.player,
                    tile: unit.tile,
                    name: unit.player.cityNames.shift() // TODO: input box/confirmation
                });

                unit.destroy();
            }
        },
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
    },
    units: [],
    getByName: (name) => {
        return engine.Unit.units.filter((unit) => unit.name === name)[0];
    },
    baseUnit: {
        attack: 0,
        defence: 0,
        movement: 1,
        visibility: 1,

        // basic size, should be consistent
        width: 16,
        height: 16,

        offsetX: 0,
        offsetY: 0,

        land: true,
        ocean: false,

        veteran: false,

        destroyed: false,
        active: false,
        busy: false
    },
    available: {}
});

Engine.Plugin.get('unit').forEach((unit) => {
    unit.contents.forEach((file) => {
        engine.Unit.units.push(extend({}, engine.Unit.baseUnit, engine.loadJSON(file)));
    });
});

engine.on('player-turn-start', (player) => {
    player.units.forEach((unit) => {
        if (unit.busy) {
            if (unit.busy < 0) {
                // sentry/fortify
            }
            else {
                unit.busy--;

                if (unit.busy <= 0) {
                    unit.currentAction.complete(unit);
                }
                else {
                    unit.movesLeft = 0;
                }
            }
        }

        if (!unit.busy) {
            unit.movesLeft = unit.movement;
            unit.active = true;
        }
    });

    engine.emit('unit-activate-next', player);
});

engine.on('unit-created', (unit) => {
    if (!unit.player.activeUnit) {
        unit.player.activeUnit = unit;
    }

    unit.tile.units.push(unit);
});

engine.on('unit-activate', (unit) => {
    unit.player.activeUnit = unit;
    unit.active = true;
});

engine.on('unit-moved', (unit, from, to) => {
    unit.applyVisibility();

    from.units = from.units.filter((tileUnit) => tileUnit !== unit);

    if ((unit.movesLeft <= 0.1) && (engine.currentPlayer.activeUnit === unit)) {
        unit.player.activeUnit = false;
        unit.active = false;

        engine.emit('unit-activate-next', unit.player);
    }
});

engine.on('unit-action', (unit, action) => {
    if ((unit.movesLeft <= 0.1) && (engine.currentPlayer.activeUnit === unit)) {
        unit.player.activeUnit = false;
        unit.active = false;

        engine.emit('unit-activate-next', unit.player);
    }
});

engine.on('unit-destroyed', (unit) => {
    unit.player.units = unit.player.units.filter((playerUnit) => playerUnit !== unit);
    unit.tile.units = unit.tile.units.filter((tileUnit) => tileUnit !== unit);
    unit.active = false;
    unit.destroyed = true;

    if (engine.currentPlayer === unit.player) {
        if (unit.player.activeUnit === unit) {
            unit.player.activeUnit = false;
        }

        engine.emit('unit-activate-next', unit.player);
    }
});

engine.on('unit-activate-next', (player) => {
    if (engine.currentPlayer.unitsToAction.length) {
        engine.emit('unit-activate', engine.currentPlayer.unitsToAction[0]);
    }
    else {
        engine.emit('player-turn-over');
    }
});
