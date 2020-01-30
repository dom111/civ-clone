import {Forest, Tundra} from '../../../base-terrain/Terrains.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import {Food} from '../../../base-yields/Yields.js';
import {Game} from '../../../base-terrain-features/TerrainFeatures.js';
import {Monarchy} from '../../../base-governments/Governments.js';
import PlayerGovernmentRegistry from '../../PlayerGovernmentRegistry.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';

RulesRegistry.register(new Rule(
  'tile:yield:production:grassland:irrigation',
  new Criterion((tileYield) => tileYield instanceof Food),
  new Criterion((tileYield, tile) => tile.terrain instanceof Forest),
  new Criterion((tileYield, tile) => tile.features.some((feature) => feature instanceof Game)),
  new Criterion((tileYield, tile, player) => {
    const [playerGovernment] = PlayerGovernmentRegistry
      .filter((playerGovernment) => playerGovernment.player === player)
    ;

    if (playerGovernment) {
      return playerGovernment.is(Monarchy);
    }

    return false;
  }),
  new Effect((tileYield) => tileYield.add(2))
));
RulesRegistry.register(new Rule(
  'tile:yield:production:grassland:irrigation',
  new Criterion((tileYield) => tileYield instanceof Food),
  new Criterion((tileYield, tile) => tile.terrain instanceof Tundra),
  new Criterion((tileYield, tile) => tile.features.some((feature) => feature instanceof Game)),
  new Criterion((tileYield, tile, player) => {
    const [playerGovernment] = PlayerGovernmentRegistry
      .filter((playerGovernment) => playerGovernment.player === player)
    ;

    if (playerGovernment) {
      return playerGovernment.is(Monarchy);
    }

    return false;
  }),
  new Effect((tileYield) => tileYield.add(1))
));