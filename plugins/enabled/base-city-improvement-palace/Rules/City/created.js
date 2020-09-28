import CityRegistry from '../../../core-city/CityRegistry.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Palace from '../../Palace.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = ({
  cityRegistry = CityRegistry.getInstance(),
} = {}) => [
  new Rule(
    'city:created:improvements:palace',
    new Criterion((city) => ! cityRegistry.getBy('player', city.player())
      .length
    ),
    new Effect((city) => new Palace({
      city,
    }))
  ),
];

export default getRules;
