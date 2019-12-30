// TODO: make this a baseClass and implementation to enable other rates to be added easily
engine.availableTradeRates.push('tax'); // add tax as a trade-rate

engine.on('player:added', (player) => {
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

engine.on('turn:end', () => {
  engine.players.forEach((player) => {
    player.cities.forEach((city) => {
      player.treasury += city.tax;

      const cost = city.maintenance;

      player.treasury -= cost;

      if (player.treasury < 100) {
        // TODO
        // if (player.tresaury < 100) {
        //     engine.emit('treasury-low')
        //     Notification
        // }
      }
      else if (player.treasury < 0) {
        // TODO: sell improvements, trigger event
      }
    });
  });
});
