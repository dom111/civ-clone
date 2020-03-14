import {
  Aqueduct,
  Barracks,
  CityWalls,
  Colosseum,
  Courthouse,
  Granary,
  Library,
  Marketplace,
  Palace,
  Temple,
} from '../../CityImprovements.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = () => [
  ...[
    [Aqueduct, 120],
    [Barracks, 40],
    [CityWalls, 120],
    [Colosseum, 200],
    [Courthouse, 80],
    [Granary, 60],
    [Library, 80],
    [Marketplace, 80],
    [Palace, 200],
    [Temple, 40],
  ]
    .map(([Improvement, cost]) => new Rule(
      `city:build-cost:${Improvement.name.toLowerCase()}`,
      new Criterion((constructor) => constructor === Improvement),
      new Effect(() => cost)
    )),
];

export default getRules;
