import {Plains} from '../../Terrains.js';
import {Land} from '../../Types.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import Rules from '../../../core-rules/Rules.js';

Rules.register(new Rule(
  'terrain:distribution:plains',
  new Criterion((Terrain) => Terrain === Plains),

  // target any tile that's just `Land`.
  new Criterion((Terrain, mapData) => mapData.some((tile) => tile instanceof Land)),
  new Effect(() => [
    {
      from: .1,
      to: .2,
      coverage: .05,
    },
    {
      from: .2,
      to: .4,
      coverage: .2,
    },
    {
      from: .1,
      to: .4,
      coverage: .15,
      path: true,
    },
    {
      from: .4,
      to: .6,
      coverage: .02,
    },
    {
      from: .6,
      to: .8,
      coverage: .2,
    },
    {
      from: .6,
      to: .9,
      coverage: .15,
      path: true,
    },
    {
      from: .8,
      to: .9,
      coverage: .05,
    },
  ])
));
