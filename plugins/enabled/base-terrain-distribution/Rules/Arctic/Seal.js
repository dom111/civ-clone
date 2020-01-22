import {Arctic, Seal} from '../../../base-terrain/Terrains.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import Rules from '../../../core-rules/Rules.js';

Rules.register(new Rule(
  'terrain:distribution:arctic:seal',
  new Criterion((Terrain) => Terrain === Seal),
  new Criterion((Terrain, mapData) => mapData.some((tile) => tile instanceof Arctic)),
  new Effect(() => [
    {
      from: 0,
      to: 1,
      coverage: .06,
    },
  ])
));
