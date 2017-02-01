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
            return this.units.filter(function(unit) {
                return !unit.busy && unit.movesLeft;
            });
        }

        get citiesToAction() {
            return this.cities.filter(function(city) {
                return !city.building;
            });
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

            player.availableRates.forEach(function(rate) {
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

engine.__defineGetter__('isTurnEnd', function() {
    return this.currentPlayer.actionsLeft === 0;
});

engine.on('build', function() {
    engine.players = [];

    // TODO: if randomize
    engine.Civilizations = engine.Civilizations.sort(function() {
        return Math.floor((Math.random() * 3) - 1);
    });

    // engine.addPlayers(); // TODO
    // for (var i = 0; i < engine.options.players; i++) {
    //     engine.players.push(new engine.Player());
    // }

    engine.players.push(new engine.Player());
    engine.players.push(new engine.Player());

    // TODO: this is testing data
    engine.currentPlayer = engine.players[0];

    new engine.Unit({
        unit: 'settler',
        tile: engine.map.get(3, 3),
        player: engine.players[0]
    });
    new engine.Unit({
        unit: 'cavalry',
        tile: engine.map.get(3, 3),
        player: engine.players[0]
    });
    new engine.Unit({
        unit: 'settler',
        tile: engine.map.get(11, 28),
        player: engine.players[1]
    });
    new engine.Unit({
        unit: 'cavalry',
        tile: engine.map.get(11, 28),
        player: engine.players[1]
    });
});
