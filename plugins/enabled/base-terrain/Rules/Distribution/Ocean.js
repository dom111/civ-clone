import {Ocean} from '../../Terrains.js';
import {Ocean as BaseOcean} from '../../Types.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import Rules from '../../../core-rules/Rules.js';

Rules.register(new Rule(
  'terrain:distribution:ocean',
  new Criterion((Terrain) => Terrain === Ocean),

  // target any tile that's just `BaseOcean`.
  new Criterion((Terrain, mapData) => mapData.some((tile) => tile.constructor === BaseOcean)),
  new Effect(() => [
    {
      fill: true,
    },
  ])
));
