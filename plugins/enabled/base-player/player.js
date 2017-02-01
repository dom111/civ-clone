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
            return this.units.filter((unit) => !unit.busy && unit.movesLeft);
        }

        get citiesToAction() {
            return this.cities.filter((city) => !city.building);
        }

        get actionsLeft() {
            return this.unitsToAction.length + this.citiesToAction.length;
        }

        static extend(object) {
            return extend(this.prototype, object);
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

engine.__defineGetter__('isTurnEnd', () => this.currentPlayer.actionsLeft === 0);

engine.on('build', () => {
    engine.players = [];

    // TODO: allow choices instead of random
    engine.Civilizations = engine.Civilizations.sort(() => Math.floor((Math.random() * 3) - 1));

    // engine.addPlayers(); // TODO
    // for (var i = 0; i < engine.options.players; i++) {
    //     engine.players.push(new engine.Player());
    // }

    engine.players.push(new engine.Player());
    engine.players.push(new engine.Player());

    // TODO: this is testing data
    new engine.Unit({
        unit: 'settlers',
        tile: engine.map.get(3, 3),
        player: engine.players[0]
    });
    new engine.Unit({
        unit: 'cavalry',
        tile: engine.map.get(3, 3),
        player: engine.players[0]
    });
    new engine.Unit({
        unit: 'settlers',
        tile: engine.map.get(7, 3),
        player: engine.players[1]
    });
    new engine.Unit({
        unit: 'cavalry',
        tile: engine.map.get(7, 3),
        player: engine.players[1]
    });
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
