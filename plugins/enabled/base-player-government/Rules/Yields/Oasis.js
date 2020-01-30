import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import {Food} from '../../../base-terrain-yields/Yields.js';
import {Monarchy} from '../../../base-governments/Governments.js';
import {Oasis} from '../../../base-terrain-features/TerrainFeatures.js';
import PlayerGovernmentRegistry from '../../PlayerGovernmentRegistry.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';

RulesRegistry.register(new Rule(
  'tile:yield:production:grassland:irrigation',
  new Criterion((tileYield) => tileYield instanceof Food),
  new Criterion((tileYield, tile) => tile.features.some((feature) => feature instanceof Oasis)),
  new Criterion((tileYield, tile, player) => {
    const [playerGovernment] = PlayerGovernmentRegistry.getBy('player', player);

    if (playerGovernment) {
      return playerGovernment.is(Monarchy);
    }

    return false;
  }),
  new Effect((tileYield) => tileYield.add(1))
));
