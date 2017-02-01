Game.availableTradeRates.push('tax'); // add tax as a trade-rate

Game.on('player-added', (player) => {
    player.treasury = (Game.options.difficulty === 0 ? 50 : 0);
});

// City.prototype
City.prototype.__defineGetter__('tax', function() {
    // TODO: marketplace multiplier
    this.calculateRates();

    return this.rates.tax;
});

Game.on('city-created', function(city) {
    city.on('turn-end', function() {
        this.player.treasury += this.tax;
    });
});
