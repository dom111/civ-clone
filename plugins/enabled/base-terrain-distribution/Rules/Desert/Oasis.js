import {Desert, Oasis} from '../../../base-terrain/Terrains.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import Rules from '../../../core-rules/Rules.js';

Rules.register(new Rule(
  'terrain:distribution:desert:oasis',
  new Criterion((Terrain) => Terrain === Oasis),
  new Criterion((Terrain, mapData) => mapData.some((tile) => tile instanceof Desert)),
  new Effect(() => [
    {
      from: 0,
      to: 1,
      coverage: .06,
    },
  ])
));
