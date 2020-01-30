import Criterion from '../../core-rules/Criterion.js';
import Effect from '../../core-rules/Effect.js';
import {Jungle} from '../../base-terrain/Terrains.js';
import {Land} from '../../core-terrain/Types.js';
import Rule from '../../core-rules/Rule.js';
import RulesRegistry from '../../core-rules/RulesRegistry.js';

RulesRegistry.register(new Rule(
  'terrain:distribution:jungle',
  new Criterion((Terrain) => Terrain === Jungle),

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
