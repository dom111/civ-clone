import CityRegistry from '../../../core-city/CityRegistry.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules-registry/RulesRegistry.js';

export const getRules = ({
  cityRegistry = CityRegistry.getInstance(),
  rulesRegistry = RulesRegistry.getInstance(),
  // engine = engine,
} = {}) => [
  new Rule(
    'player:turn-start:city-happiness',
    new Effect((player) => cityRegistry.getBy('player', player)
      .forEach((city) => {
        if (rulesRegistry.get('city:civil-disorder')
          .some((rule) => rule.validate(city))
        ) {
          engine.emit('city:civil-disorder', city);
        }

        if (rulesRegistry.get('city:celebrate-leader')
          .some((rule) => rule.validate(city))
        ) {
          engine.emit('city:leader-celebration', city);
        }
      })
    )
  ),
];

export default getRules;
