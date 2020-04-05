import Criterion from '../../../core-rules/Criterion.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = () => [
  new Rule(
    'tile:goody-hut:land-only',
    new Criterion((tile) => tile.isLand())
  ),
  new Rule(
    'tile:goody-hut:chance',
    new Criterion(() => Math.random() < .07)
  ),
];

export default getRules;
