import Criterion from '../../core-rules/Criterion.js';
import Effect from '../../core-rules/Effect.js';
import {Land} from '../../core-terrain/Types.js';
import {River} from '../../base-terrain/Terrains.js';
import Rule from '../../core-rules/Rule.js';
import RulesRegistry from '../../core-rules/RulesRegistry.js';

RulesRegistry.register(new Rule(
  'terrain:distribution:river',
  new Criterion((Terrain) => Terrain === River),

  new Criterion((Terrain, mapData) => mapData.some((tile) => tile instanceof Land)),
  new Effect(() => [
    {
      from: .1,
      to: .9,
      coverage: .1,
      path: true,
      pathChance: .05,
    },
  ])
));