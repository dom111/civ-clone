import Criterion from '../../core-rules/Criterion.js';
import Effect from '../../core-rules/Effect.js';
import {Land} from '../../core-terrain/Types.js';
import {Plains} from '../../base-terrain/Terrains.js';
import Rule from '../../core-rules/Rule.js';
import RulesRegistry from '../../core-rules/RulesRegistry.js';

RulesRegistry.register(new Rule(
  'terrain:distribution:plains',
  new Criterion((Terrain) => Terrain === Plains),

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
