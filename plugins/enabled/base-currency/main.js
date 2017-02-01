'use strict';

engine.availableTradeRates.push('tax'); // add tax as a trade-rate

engine.on('player-added', function(player) {
    player.treasury = (engine.options.difficulty === 0 ? 50 : 0);
});

if ('City' in engine) {
    // City.prototype
    engine.City.prototype.__defineGetter__('tax', function() {
        // TODO: marketplace multiplier
        this.calculateRates();

        return this.rates.tax;
    });
}

engine.on('turn-end', function() {
    engine.players.forEach(function(player) {
        player.cities.forEach(function(city) {
            player.treasury += city.tax;

            var cost = city.maintenance;

            if (player.treasury >= cost) {
                player.treasury -= cost;

                // TODO
                // if (player.tresaury < 100) {
                //     engine.emit('treasury-low')
                //     Notification
                // }
            }
            else {
                // TODO: sell improvements, trigger event
            }

        });
    });
});
