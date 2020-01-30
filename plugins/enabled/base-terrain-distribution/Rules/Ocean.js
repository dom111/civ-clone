import Criterion from '../../core-rules/Criterion.js';
import Effect from '../../core-rules/Effect.js';
import {Ocean} from '../../base-terrain/Terrains.js';
import Rule from '../../core-rules/Rule.js';
import RulesRegistry from '../../core-rules/RulesRegistry.js';
import {Water} from '../../core-terrain/Types.js';

RulesRegistry.register(new Rule(
  'terrain:distribution:ocean',
  new Criterion((Terrain) => Terrain === Ocean),

  new Criterion((Terrain, mapData) => mapData.some((tile) => tile.constructor === Water)),
  new Effect(() => [
    {
      fill: true,
    },
  ])
));
