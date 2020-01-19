import {Swamp} from '../../Terrains.js';
import {Land} from '../../Types.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import Rules from '../../../core-rules/Rules.js';

Rules.register(new Rule(
  'terrain:distribution:river',
  new Criterion((Terrain) => Terrain === Swamp),

  // target any tile that's just `Land`.
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

