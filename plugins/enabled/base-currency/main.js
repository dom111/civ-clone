game.availableTradeRates.push('tax'); // add tax as a trade-rate

game.on('player-added', function(player) {
    player.treasury = (game.options.difficulty === 0 ? 50 : 0);
});

// City.prototype
City.prototype.__defineGetter__('tax', function() {
    // TODO: marketplace multiplier
    this.calculateRates();

    return this.rates.tax;
});

game.on('turn-end', function() {
    game.players.forEach(function(player) {
        player.cities.forEach(function(city) {
            player.treasury += city.tax;

            var cost = city.maintenance;

            if (player.treasury >= cost) {
                player.treasury -= cost;

                // TODO
                // if (player.tresaury < 100) {
                //     game.emit('treasury-low')
                //     Notification
                // }
            }
            else {
                // TODO: sell improvements, trigger event
            }

        });
    });
});
