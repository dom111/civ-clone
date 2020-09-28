import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import Settlers from '../../Settlers.js';

export const getRules = () => [
  new Rule(
    'city:build:unit:settlers',
    new Criterion((city, buildItem) => buildItem === Settlers),
    new Effect((city) => new Criterion(() => city.size() >= 2))
  ),
];

export default getRules;
