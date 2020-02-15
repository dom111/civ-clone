import Criterion from '../../core-rules/Criterion.js';
import Effect from '../../core-rules/Effect.js';
import {Land} from '../../core-terrain/Types.js';
import Rule from '../../core-rules/Rule.js';
import RulesRegistry from '../../core-rules/RulesRegistry.js';
import {Tundra} from '../../base-terrain/Terrains.js';

RulesRegistry.register(new Rule(
  'terrain:distribution:river',
  new Criterion((Terrain) => Terrain === Tundra),

  new Criterion((Terrain, mapData) => mapData.some((tile) => tile instanceof Land)),
  new Effect(() => [
    {
      from: .02,
      to: .15,
      cluster: true,
    },
    {
      from: .85,
      to: .98,
      cluster: true,
    },
  ])
));
