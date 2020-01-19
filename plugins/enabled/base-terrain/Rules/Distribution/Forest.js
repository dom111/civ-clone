import {Forest} from '../../Terrains.js';
import {Land} from '../../Types.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import Rules from '../../../core-rules/Rules.js';

Rules.register(new Rule(
  'terrain:distribution:forest',
  new Criterion((Terrain) => Terrain === Forest),

  // target any tile that's just `Land`.
  new Criterion((Terrain, mapData) => mapData.some((tile) => tile instanceof Land)),
  new Effect(() => [
    {
      from: .05,
      to: .2,
      coverage: .15,
      cluster: true,
    },
    {
      from: .2,
      to: .4,
      coverage: .2,
      cluster: true,
    },
    {
      from: .1,
      to: .4,
      coverage: .2,
      path: true,
    },
    {
      from: .4,
      to: .6,
      coverage: .08,
      cluster: true,
    },
    {
      from: .6,
      to: .8,
      coverage: .2,
      cluster: true,
    },
    {
      from: .6,
      to: .9,
      coverage: .2,
      path: true,
    },
    {
      from: .8,
      to: .95,
      coverage: .15,
      cluster: true,
    },
  ])
));
