'use strict';

extend(engine, {
    Player: class Player {
        constructor(details) {
            var player = this;

            if (typeof details === 'undefined') {
                details = engine.Civilizations.pop();
            }

            extend(player, details || {});

            player.id = engine.players.length;
            player.cities = [];
            player.units = [];
            player.availableRates = engine.availableTradeRates;
            player.rates = {};
            player.availableUnits = [];
            player.availableImprovements = [];

            engine.emit('player-added', player);

            player.assignRates();
        }

        get unitsToAction() {
            return this.units.filter((unit) => unit.active && unit.movesLeft);
        }

        get citiesToAction() {
            return this.cities.filter((city) => !city.building);
        }

        get actionsLeft() {
            return this.unitsToAction.length + this.citiesToAction.length;
        }

        get visibleTiles() {
            if (this._visibleTiles) {
                return this._visibleTiles;
            }

            this._visibleTiles = [];

            this.units.forEach((unit) => {
                for (var x = -unit.visibility; x <= unit.visibility; x++) {
                    for (var y = -unit.visibility; y <= unit.visibility; y++) {
                        var _tile = engine.map.get(unit.tile.x + x, unit.tile.y + y);
                        if (!this._visibleTiles.includes(_tile)) {
                            this._visibleTiles.push(_tile);
                        }
                    }
                }
            });

            this.cities.forEach((city) => {
                for (var x = -2; x <= 2; x++) {
                    for (var y = -2; y <= 2; y++) {
                        var _tile = engine.map.get(city.tile.x + x, city.tile.y + y);
                        if (!this._visibleTiles.includes(_tile)) {
                            this._visibleTiles.push(_tile);
                        }
                    }
                }
            });

            return this._visibleTiles;
        }

        assignRates() {
            var player = this,
            remaining = 1;

            player.availableRates.forEach((rate) => {
                player.rates[rate] = Math.ceil((1 / player.availableRates.length) * 100) / 100;
                remaining -= player.rates[rate];
            });

            player.rates[player.availableRates[0]] += remaining; // TODO, spread more evenly, also, maybe 5% increments?
        }

        getRate(rate) {
            if (this.availableRates.includes(rate)) {
                return this.rates[rate];
            }

            throw `No rate '${rate}'!`;
        }
    }
});

extend(engine.Player, {
    AI: class AI extends engine.Player {
        // TODO: basic AI implementation, or at least methods to be called from another AI implementation
    }
});

engine.__defineGetter__('isTurnEnd', () => (!this.currentPlayer) || (this.currentPlayer.actionsLeft === 0));

engine.on('turn-over', () => {
    if (engine.isTurnEnd) {
        engine.emit('turn-end');
    }
    else {
        console.log('No auto end-turn because there are actions left: ' + engine.currentPlayer.actionsLeft);
    }
});

engine.on('build', () => {
    engine.players = [];

    // TODO: allow choices instead of random
    engine.Civilizations = engine.Civilizations.sort(() => Math.floor((Math.random() * 3) - 1));

    // engine.addPlayers(); // TODO
    let startingSquares = engine.map.getBy(tile => tile.food >= 2);
    startingSquares.sort(() => Math.floor(3 * Math.random()) - 1);

    for (var i = 0; i < engine.options.players; i++) {
        let player = new engine.Player();
        let startSquare = startingSquares.shift();

        engine.players.push(player);

        new engine.Unit({
            unit: 'settlers',
            tile: startSquare,
            player: player
        });
        new engine.Unit({
            unit: 'cavalry',
            tile: startSquare,
            player: player
        });
    }
});

engine.on('turn-start', () => {
    engine.playersToAction = engine.players.slice(0);
    engine.currentPlayer = engine.playersToAction.shift();

    engine.emit('player-turn-start', engine.currentPlayer);
});

engine.on('player-turn-end', (player) => {
    if (engine.isTurnEnd) {
        if (engine.playersToAction.length) {
            engine.currentPlayer = engine.playersToAction.shift();
            engine.emit('player-turn-start', engine.currentPlayer);
        }
        else {
            engine.emit('turn-end');
        }
    }
    else {
        console.log('Not turn end.');
    }
});

engine.on('player-visibility-changed', (player) => {
    player._visibleTiles = false;
    engine.emit('build-layer', 'visibility');
    engine.emit('build-layer', 'activeVisibility');
});