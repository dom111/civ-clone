import Criterion from '../../core-rules/Criterion.js';
import {Desert} from '../../base-terrain/Terrains.js';
import Effect from '../../core-rules/Effect.js';
import {Land} from '../../core-terrain/Types.js';
import Rule from '../../core-rules/Rule.js';
import RulesRegistry from '../../core-rules/RulesRegistry.js';

RulesRegistry.register(new Rule(
  'terrain:distribution:desert',
  new Criterion((Terrain) => Terrain === Desert),

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
