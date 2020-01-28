import Criterion from '../../core-rules/Criterion.js';
import Effect from '../../core-rules/Effect.js';
import {Land} from '../../core-terrain/Types.js';
import Rule from '../../core-rules/Rule.js';
import Rules from '../../core-rules/Rules.js';
import {Swamp} from '../../base-terrain/Terrains.js';

Rules.register(new Rule(
  'terrain:distribution:river',
  new Criterion((Terrain) => Terrain === Swamp),

  new Criterion((Terrain, mapData) => mapData.some((tile) => tile instanceof Land)),
  new Effect(() => [
    {
      from: .2,
      to: .4,
      coverage: .025,
      cluster: true,
      path: false,
    },
    {
      from: .6,
      to: .8,
      coverage: .025,
      cluster: true,
      path: false,
    },
  ])
));

