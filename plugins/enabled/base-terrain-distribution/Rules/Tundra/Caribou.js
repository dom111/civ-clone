import {Caribou, Tundra} from '../../../base-terrain/Terrains.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import Rules from '../../../core-rules/Rules.js';

Rules.register(new Rule(
  'terrain:distribution:tundra:caribou',
  new Criterion((Terrain) => Terrain === Caribou),
  new Criterion((Terrain, mapData) => mapData.some((tile) => tile instanceof Tundra)),
  new Effect(() => [
    {
      from: 0,
      to: 1,
      coverage: .06,
    },
  ])
));
