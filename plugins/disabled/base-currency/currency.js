import Treasury from './Treasury.js';

// TODO: make this a baseClass and implementation to enable other rates to be added easily
if (! ('availableTradeRates' in engine)) {
  engine.availableTradeRates = [];
}

const treasuries = new Map();

engine.availableTradeRates.push('tax'); // add tax as a trade-rate

engine.on('player:added', (player) => {
  const treasury = new Treasury();

  treasury.add(engine.option('difficulty') === 0 ? 50 : 0);
  treasuries.set(player, treasury);
});

// TODO: sort a mechanism for this
// if ('City' in engine) {
//   // City.prototype
//   engine.City.prototype.__defineGetter__('tax', function() {
//     // TODO: marketplace multiplier, etc
//     this.calculateRates();
//
//     return this.rates.tax;
//   });
// }

engine.on('player:turn-start', (player) => {
  player.cities.forEach((city) => {
    const treasury = treasuries.get(player);

    treasury.add(city.trade);

    const cost = city.maintenance;

    treasury.remove(cost);

    if (treasury < 100) {
      engine.emit('player:treasury-low', player, treasury);
    }
    else if (treasury < 0) {
      engine.emit('player:treasury-exhausted', player, treasury);
      // TODO: sell improvements, disband units
    }
  });
});
