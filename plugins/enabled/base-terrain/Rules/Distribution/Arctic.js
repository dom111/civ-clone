import {Arctic} from '../../Terrains.js';
import {Land} from '../../Types.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import Rules from '../../../core-rules/Rules.js';

Rules.register(new Rule(
  'terrain:distribution:arctic',
  new Criterion((Terrain) => Terrain === Arctic),

  // target any tile that's just `Land`.
  new Criterion((Terrain, mapData) => mapData.some((tile) => tile instanceof Land)),
  new Effect(() => [
    {
      from: .0,
      to: .02,
      coverage: 1,
      cluster: true,
    },
    {
      from: .02,
      to: .1,
      coverage: .05,
    },
    {
      from: .90,
      to: .98,
      coverage: .05,
    },
    {
      from: .98,
      to: 1,
      coverage: 1,
      cluster: true,
    },
  ])
));
