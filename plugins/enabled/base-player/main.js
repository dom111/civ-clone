'use strict';

extend(engine, {
    Player: class Player {
        constructor(details) {
            var player = this;

            if (typeof details === 'undefined') {
                details = engine.Civilizations.sort(function() {
                    return Math.floor((Math.random() * 3) - 1);
                })[0];
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
