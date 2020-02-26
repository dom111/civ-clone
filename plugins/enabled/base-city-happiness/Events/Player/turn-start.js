import CityRegistry from '../../../core-city/CityRegistry.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';

engine.on('player:turn-start', (player) => {
  CityRegistry.getBy('player', player)
    .forEach((city) => {
      if (RulesRegistry.get('city:civil-disorder')
        .some((rule) => rule.validate(city))
      ) {
        engine.emit('city:civil-disorder', city);
      }

      if (RulesRegistry.get('city:celebrate-leader')
        .some((rule) => rule.validate(city))
      ) {
        engine.emit('city:leader-celebration', city);
      }
    });
});
