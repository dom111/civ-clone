'use strict';

extend(engine, {
    Unit: class Unit {
        constructor(details) {
            var unit = this,
            baseUnit = Unit.getByName(details.unit);

            if (!baseUnit) {
                throw `Unknown unit '${details.unit}'.`;
            }

            extend(unit, baseUnit);
            extend(unit, details);
            unit.actions = {};

            unit.destroyed = false;

            unit.player.units.push(unit);

            Object.keys(Unit.availableActions).forEach((actionName) => {
                var action = Unit.availableActions[actionName];

                if (!action.availableTo || ((!action.availableTo.include || (!action.availableTo.include.length || action.availableTo.include.includes(unit.name))) && (!action.availableTo.exclude || (!action.availableTo.exclude.length || !action.availableTo.exclude.includes(unit.name))))) {
                    unit.actions[action.name] = action;
                }
            });

            unit.applyVisibility();

            engine.emit('unit-created', unit);
        }

        applyVisibility() {
            for (var x = this.tile.x - this.visibility; x <= this.tile.x + this.visibility; x++) {
                for (var y = this.tile.y - this.visibility; y <= this.tile.y + this.visibility; y++) {
                    engine.emit('tile-seen', engine.map.get(x, y), this.player);
                }
            }
        }

        validateMove(to) {
            if (!to) {
                return false;
            }

            var unit = this,
            neighbours = unit.tile.neighbours;

            if (unit.movesLeft <= 0.1) {
                return false;
            }

            if (!Object.keys(neighbours).map((position) => neighbours[position]).includes(to)) {
                return false;
            }

            if (to.terrain.ocean && unit.land) {
                return false;
            }

            if (to.terrain.land && unit.ocean) {
                // TODO: transportation units
                return false;
            }

            if (to.units.length && to.units[0].player != unit.player) {
                return this.resolveCombat(to.units);
            }

            if (to.city && to.city.player != unit.player) {
                // TODO: interact
                return false;
            }

            // TODO: adjacency rules

            // TODO
            var movementCost = unit.tile.movementCost(to);

            if (movementCost > this.movesLeft) {
                if ((Math.random() * 1.5) < (this.movesLeft / movementCost)) {
                    this.movesLeft = 0;

                    return false;
                }
            }

            return movementCost;
        }

        move(to) {
            var unit = this,
            from = unit.tile;

            if (['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'].includes(to)) {
                to = unit.tile.neighbours[to];
            }

            var movementCost = unit.validateMove(to);

            if (movementCost !== false) {
                unit.tile.units = unit.tile.units.filter((tileUnit) => tileUnit !== unit);

                unit.tile = to;
                unit.tile.units.push(unit);

                unit.movesLeft -= movementCost;

                if (unit.movesLeft < 0.1) {
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
            var defender = units.sort((a,b) => a.defense > b.defense ? -1 : a.defense == b.defense ? 0 : 1),
            result = Unit.combat.resolve(this, defender);

            if (result) {
                if (unit.tile.city || unit.tile.improvements.includes('fortress')) {
                    defender.destroy();
                }
                else {
                    unit.tile.units.forEach((unit) => unit.destroy());
                }
            }
            else {
                this.desroy();
            }

            return result;
        }

        action(action) {
            if (this.can(action)) {
                this.actions[action].run(this);

                engine.emit('unit-moved', this, this.tile, this.tile);
            }
            else {
                console.log("Can't call action " + action + " on " + this.player.people + " " + this.title);
            }
        }

        can(action) {
            return action in this.actions;
        }

        destroy() {
            var unit = this;

            unit.player.units = unit.player.units.filter((playerUnit) => playerUnit !== unit);

            unit.tile.units = unit.tile.units.filter((tileUnit) => tileUnit !== unit);

            unit.active = false;
            unit.destroyed = true;

            engine.emit('unit-destroyed', unit);
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
            run: (unit) => {
                unit.busy = -1;
                unit.inactive = true;
                unit.style = {
                    opacity:.5
                };
            }
        },
        fortify: {
            name: 'fortify',
            title: 'Fortify',
            turns: 1,
            run: (unit) => {
                unit.busy = -1;
                unit.inactive = true;
                unit.fortified = true;
            }
        },
        disband: {
            name: 'disband',
            title: 'Disband',
            turns: 0,
            run: (unit) => unit.destroy()
        },
        pillage: {
            name: 'pillage',
            title: 'Pillage',
            turns: 1,
            run: (unit) => engine.emit('tile-improvement-pillaged', unit.tile, unit.tile.improvements[0])
        },
        noOrders: {
            name: 'noOrders',
            title: 'No orders',
            turns: 0,
            run: (unit) => unit.movesLeft = 0
        },
        buildCity: {
            name: 'buildCity',
            title: 'Build city',
            turns: 0,
            run: (unit) => {
                new engine.City({
                    player: unit.player,
                    tile: unit.tile,
                    // TODO
                    name: unit.player.cityNames.shift()
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
            run: (unit) => {
                if (!unit.tile.improvements.includes('irrigation') && unit.tile.terrain.improvements.irrigation && (Object.keys(unit.tile.adjacent).map((direction) => unit.tile.adjacent[direction]).filter((tile) => tile.terrain.name === 'river' || (tile.improvements.includes('irrigation') && !tile.city) || tile.terrain.ocean).length || unit.tile.terrain.name === 'river')) {
                    unit.status = this.key;
                    // TODO: terrain modifier
                    unit.busy = this.turns;
                    unit.movesLeft = 0;
                    unit.currentAction = this;
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
            run: (unit) => {
                if (!unit.tile.improvements.includes('road') && unit.tile.terrain.improvements.road) {
                    unit.status = this.key;
                    // TODO: terrain modifier
                    unit.busy = this.turns;
                    unit.movesLeft = 0;
                    unit.currentAction = this;
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
            run: (unit) => {
                if (!unit.tile.improvements.includes('mine') && unit.tile.terrain.improvements.mine) {
                    unit.status = this.key;
                    // TODO: terrain modifier
                    unit.busy = this.turns;
                    unit.movesLeft = 0;
                    unit.currentAction = this;
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
    }
});

Engine.Plugin.get('unit').forEach((unit) => {
    unit.contents.forEach((file) => {
        engine.Unit.units.push(extend({
            attack: 0,
            defense: 0,
            movement: 1,
            visibility: 1,
            width: 16,
            height: 16,
            land: true,
            ocean: false,
            veteran: false
        }, engine.loadJSON(file)));
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
            }
        }

        unit.movesLeft = unit.movement;
        unit.inactive = false;
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
    unit.inactive = false;
});

engine.on('unit-moved', (unit, from, to) => {
    unit.applyVisibility();

    from.units = from.units.filter((tileUnit) => tileUnit !== unit);

    if (unit.movesLeft <= 0.1) {
        unit.player.activeUnit = false;
        unit.active = false;
        unit.inactive = true;

        engine.emit('unit-activate-next', unit.player);
    }
});

engine.on('unit-destroyed', (unit) => {
    if ((engine.activePlayer === unit.player) && (unit.player.activeUnit === unit)) {
        unit.player.activeUnit = false;
    }

    unit.tile.units = unit.tile.units.filter((tileUnit) => tileUnit !== unit);

    if (engine.activePlayer === unit.player) {
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
