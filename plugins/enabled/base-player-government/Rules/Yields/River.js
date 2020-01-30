import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import {Food} from '../../../base-terrain-yields/Yields.js';
import {Irrigation} from '../../../base-terrain-improvements/Improvements.js';
import {Monarchy} from '../../../base-governments/Governments.js';
import PlayerGovernmentRegistry from '../../PlayerGovernmentRegistry.js';
import {River} from '../../../base-terrain/Terrains.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';

RulesRegistry.register(new Rule(
  'tile:yield:production:grassland:irrigation',
  new Criterion((tileYield) => tileYield instanceof Food),
  new Criterion((tileYield, tile) => tile.terrain instanceof River),
  new Criterion((tileYield, tile) => tile.improvements.some((improvement) => improvement instanceof Irrigation)),
  new Criterion((tileYield, tile, player) => {
    const [playerGovernment] = PlayerGovernmentRegistry.getBy('player', player);

    if (playerGovernment) {
      return playerGovernment.is(Monarchy);
    }

    return false;
  }),
  new Effect((tileYield) => tileYield.add(1))
));
