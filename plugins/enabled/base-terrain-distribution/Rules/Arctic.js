import {Arctic} from '../../base-terrain/Terrains.js';
import Criterion from '../../core-rules/Criterion.js';
import Effect from '../../core-rules/Effect.js';
import {Land} from '../../core-terrain/Types.js';
import Rule from '../../core-rules/Rule.js';
import RulesRegistry from '../../core-rules/RulesRegistry.js';

RulesRegistry.register(new Rule(
  'terrain:distribution:arctic',
  new Criterion((Terrain) => Terrain === Arctic),

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
    },
    {
      from: .90,
      to: .98,
    },
    {
      from: .98,
      to: 1,
      coverage: 1,
      cluster: true,
    },
  ])
));
