import {Happiness, Unhappiness} from './Yields.js';
import CityRegistry from '../core-city/CityRegistry.js';
import Effect from '../core-rules/Effect.js';
import Rule from '../core-rules/Rule.js';
import RulesRegistry from '../core-rules/RulesRegistry.js';

// TODO: factor in difficulty levels
RulesRegistry.register(new Rule(
  'city:happiness:base:unhappiness',
  new Effect((city) => new Unhappiness(Math.max(city.size - 5, 0)))
));

// TODO: should potentially have all yields registered and stored as promises that are resolved when all relevant rules
//  are processed...
engine.on('player:turn-start', (player) => {
  CityRegistry.getBy('player', player)
    .forEach((city) => {
      const citizens = RulesRegistry.get('city:happiness')
        .filter((rule) => rule.validate(city))
        .map((rule) => rule.process(city))
      ;

      const happiness = citizens.filter((citizenState) => citizenState instanceof Happiness)
          .reduce((total, happiness) => total + happiness.value(), 0),
        unhappiness = citizens.filter((citizenState) => citizenState instanceof Unhappiness)
          .reduce((total, unhappiness) => total + unhappiness.value(), 0)
      ;

      // TODO: rules
      if (happiness < unhappiness) {
        engine.emit('city:civil-disorder', city);
      }

      if (! unhappiness && happiness >= Math.ceil(city.size / 2)) {
        engine.emit('city:leader-celebration', city);
      }
    });
});

// It's necessary to first resolve the `Yield`s to handle any `Luxury`s that will affect happiness.
// It's also necessary to have finished processing `Production` to complete in-progress items: `Temple`s etc to directly
// impact unhappiness and indirect effects like `Marketplace`s etc affecting `Luxury` rates. THere might be the potential
// need for a custom event that will be processed once everything else is sorted.
// Once those are resolved it should be possible to calculate default `Unhappiness` and offset against the state of the
// city. Adding in a specific event doesn't seem like it would be the best approach as there may be other similar' +
// 'circumstances that are present in the other games.
