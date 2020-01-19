import {Desert} from '../../Terrains.js';
import {Land} from '../../Types.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import Rules from '../../../core-rules/Rules.js';

Rules.register(new Rule(
  'terrain:distribution:desert',
  new Criterion((Terrain) => Terrain === Desert),

  // target any tile that's just `Land`.
  new Criterion((Terrain, mapData) => mapData.some((tile) => tile instanceof Land)),
  new Effect(() => [
    {
      from: .4,
      to: .45,
      coverage: .1,
    },
    {
      from: .45,
      to: .55,
      coverage: .4,
      cluster: true,
    },
    {
      from: .55,
      to: .6,
      coverage: .1,
    },
  ])
));
