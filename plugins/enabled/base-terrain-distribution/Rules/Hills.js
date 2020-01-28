import Criterion from '../../core-rules/Criterion.js';
import Effect from '../../core-rules/Effect.js';
import {Hills} from '../../base-terrain/Terrains.js';
import {Land} from '../../core-terrain/Types.js';
import Rule from '../../core-rules/Rule.js';
import Rules from '../../core-rules/Rules.js';

Rules.register(new Rule(
  'terrain:distribution:hills',
  new Criterion((Terrain) => Terrain === Hills),

  new Criterion((Terrain, mapData) => mapData.some((tile) => tile instanceof Land)),
  new Effect(() => [
    {
      from: .1,
      to: .9,
      coverage: .1,
      cluster: true,
      clusterChance: .6,
      path: true,
    },
  ])
));
