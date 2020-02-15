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
    },
    {
      from: .2,
      to: .4,
    },
    {
      from: .1,
      to: .4,
      path: true,
    },
    {
      from: .4,
      to: .6,
    },
    {
      from: .6,
      to: .8,
    },
    {
      from: .6,
      to: .9,
      path: true,
    },
    {
      from: .8,
      to: .9,
    },
  ])
));
