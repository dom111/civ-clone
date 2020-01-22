import Criterion from '../../core-rules/Criterion.js';
import Effect from '../../core-rules/Effect.js';
import {Land} from '../../core-terrain/Types.js';
import {Mountains} from '../../base-terrain/Terrains.js';
import Rule from '../../core-rules/Rule.js';
import Rules from '../../core-rules/Rules.js';

Rules.register(new Rule(
  'terrain:distribution:mountains',
  new Criterion((Terrain) => Terrain === Mountains),

  // target any tile that's just `Land`.
  new Criterion((Terrain, mapData) => mapData.some((tile) => tile instanceof Land)),
  new Effect(() => [
    {
      from: .1,
      to: .9,
      coverage: .05,
      cluster: true,
      clusterChange: .8,
      path: true,
    },
  ])
));
