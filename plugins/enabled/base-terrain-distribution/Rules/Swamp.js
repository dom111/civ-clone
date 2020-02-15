import Criterion from '../../core-rules/Criterion.js';
import Effect from '../../core-rules/Effect.js';
import {Land} from '../../core-terrain/Types.js';
import Rule from '../../core-rules/Rule.js';
import RulesRegistry from '../../core-rules/RulesRegistry.js';
import {Swamp} from '../../base-terrain/Terrains.js';

RulesRegistry.register(new Rule(
  'terrain:distribution:river',
  new Criterion((Terrain) => Terrain === Swamp),

  new Criterion((Terrain, mapData) => mapData.some((tile) => tile instanceof Land)),
  new Effect(() => [
    {
      from: .2,
      to: .4,
      cluster: true,
    },
    {
      from: .6,
      to: .8,
      cluster: true,
    },
  ])
));

