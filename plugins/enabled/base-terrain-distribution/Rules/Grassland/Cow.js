import {Cow, Grassland} from '../../../base-terrain/Terrains.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import Rules from '../../../core-rules/Rules.js';

Rules.register(new Rule(
  'terrain:distribution:grassland:shield',
  new Criterion((Terrain) => Terrain === Cow),
  new Criterion((Terrain, mapData) => mapData.some((tile) => tile instanceof Grassland)),
  new Effect(() => [
    {
      from: 0,
      to: 1,
      coverage: .06,
    },
  ])
));
