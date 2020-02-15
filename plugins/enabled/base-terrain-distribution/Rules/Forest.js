import Criterion from '../../core-rules/Criterion.js';
import Effect from '../../core-rules/Effect.js';
import {Forest} from '../../base-terrain/Terrains.js';
import {Land} from '../../core-terrain/Types.js';
import Rule from '../../core-rules/Rule.js';
import RulesRegistry from '../../core-rules/RulesRegistry.js';

RulesRegistry.register(new Rule(
  'terrain:distribution:forest',
  new Criterion((Terrain) => Terrain === Forest),

  new Criterion((Terrain, mapData) => mapData.some((tile) => tile instanceof Land)),
  new Effect(() => [
    {
      from: .05,
      to: .2,
    },
    {
      from: .2,
      to: .4,
      cluster: true,
      clusterChance: .4,
      coverage: .4,
    },
    {
      from: .4,
      to: .6,
    },
    {
      from: .6,
      to: .8,
      cluster: true,
      clusterChance: .4,
      coverage: .4,
    },
    {
      from: .8,
      to: .95,
    },
  ])
));
