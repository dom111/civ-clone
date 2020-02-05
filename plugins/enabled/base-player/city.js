import CityRegistry from '../core-city/CityRegistry.js';
import RulesRegistry from '../core-rules/RulesRegistry.js';
import UnitRegistry from '../core-unit/UnitRegistry.js';

engine.on('city:building-complete', (city, item) => {
  RulesRegistry.get('city:building-complete')
    .forEach((rule) => {
      if (rule.validate(city, item)) {
        rule.process(city, item);
      }
    })
  ;
});

engine.on('city:captured', (capturedCity, player) => {
  capturedCity.size--;

  if (capturedCity.size <= 0) {
    engine.emit('city:destroyed', capturedCity, player);
  }

  if (CityRegistry.getBy('player', capturedCity.player).length === 0) {
    UnitRegistry.getBy('player', capturedCity.player)
      .forEach((unit) => unit.destroy())
    ;

    engine.emit('player:defeated', capturedCity.player, player);
  }

  if (! capturedCity.originalPlayer) {
    capturedCity.originalPlayer = capturedCity.player;
  }

  capturedCity.player = player;
});

engine.on('city:created', (city) => {
  CityRegistry.register(city);
});
