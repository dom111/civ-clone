import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import {Monarchy} from '../../../base-governments/Governments/Monarchy.js';
import {Oil} from '../../../base-terrain-features/TerrainFeatures.js';
import PlayerGovernmentRegistry from '../../PlayerGovernmentRegistry.js';
import {Production} from '../../../base-terrain-yields/Yields.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';

RulesRegistry.register(new Rule(
  'tile:yield:production:horse',
  new Criterion((tileYield) => tileYield instanceof Production),
  new Criterion((tileYield, tile) => tile.terrain.features.some((feature) => feature instanceof Oil)),
  new Criterion((tileYield, tile, player) => {
    const [playerGovernment] = PlayerGovernmentRegistry.getBy('player', player);

    if (playerGovernment) {
      return playerGovernment.is(Monarchy);
    }

    return false;
  }),
  new Effect((tileYield) => tileYield.add(2))
));
