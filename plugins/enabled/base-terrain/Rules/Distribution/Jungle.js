import {Jungle} from '../../Terrains.js';
import {Land} from '../../Types.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import Rules from '../../../core-rules/Rules.js';

Rules.register(new Rule(
  'terrain:distribution:jungle',
  new Criterion((Terrain) => Terrain === Jungle),

  // target any tile that's just `Land`.
  new Criterion((Terrain, mapData) => mapData.some((tile) => tile instanceof Land)),
  new Effect(() => [
    {
      from: .3,
      to: .45,
      coverage: .3,
      cluster: true,
      path: false,
    },
    {
      from: .55,
      to: .7,
      coverage: .3,
      cluster: true,
      path: false,
    },
  ])
));
