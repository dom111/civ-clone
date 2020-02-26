import {Coal, Fish, Game, Horse, Oasis, Oil} from '../../../base-terrain-features/TerrainFeatures.js';
import {Food, Production} from '../../../base-terrain-yields/Yields.js';
import {Grassland, Hills, Plains, River, Tundra} from '../../../base-terrain/Terrains.js';
import {Irrigation, Mine} from '../../../base-tile-improvements/TileImprovements.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import {Monarchy} from '../../../base-governments/Governments/Monarchy.js';
import PlayerGovernmentRegistry from '../../PlayerGovernmentRegistry.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';
import TileImprovementRegistry from '../../../core-tile-improvements/TileImprovementRegistry.js';

[
  [Production, Coal, 1, Monarchy],
  [Food, Fish, 1, Monarchy],
  [Food, Horse, 1, Monarchy],
  [Food, Oasis, 1, Monarchy],
  [Production, Oil, 1, Monarchy],
]
  .forEach(([Yield, Feature, value, ...Governments]) => {
    RulesRegistry.register(new Rule(
      `tile:yield:${[Yield.name, Feature.name, Governments.map((Government) => Government.name).join('-')].join(':').toLowerCase()}`,
      new Criterion((tileYield) => tileYield instanceof Yield),
      new Criterion((tileYield, tile) => tile.terrain.features.some((feature) => feature instanceof Feature)),
      new Criterion((tileYield, tile, player) => {
        const [playerGovernment] = PlayerGovernmentRegistry.getBy('player', player);

        if (playerGovernment) {
          return playerGovernment.is(...Governments);
        }

        return false;
      }),
      new Effect((tileYield) => tileYield.add(value))
    ));
  })
;

[
  [Production, Game, 1, Plains, Monarchy],
  [Food, Game, 1, Tundra, Monarchy],
]
  .forEach(([Yield, Feature, value, Terrain, ...Governments]) => {
    RulesRegistry.register(new Rule(
      `tile:yield:${[Yield.name, Feature.name, Governments.map((Government) => Government.name).join('-')].join(':').toLowerCase()}`,
      new Criterion((tileYield) => tileYield instanceof Yield),
      new Criterion((tileYield, tile) => tile.terrain instanceof Terrain),
      new Criterion((tileYield, tile) => tile.terrain.features.some((feature) => feature instanceof Feature)),
      new Criterion((tileYield, tile, player) => {
        const [playerGovernment] = PlayerGovernmentRegistry.getBy('player', player);

        if (playerGovernment) {
          return playerGovernment.is(...Governments);
        }

        return false;
      }),
      new Effect((tileYield) => tileYield.add(value))
    ));
  })
;

[
  [Food, Grassland, Irrigation, 1, Monarchy],
  [Production, Hills, Mine, 1, Monarchy],
  [Food, River, Irrigation, 1, Monarchy],
]
  .forEach(([Yield, Terrain, Improvement, value, ...Governments]) => {
    RulesRegistry.register(new Rule(
      `tile:yield:${[Yield.name, Terrain.name, Improvement.name, Governments.map((Government) => Government.name).join('-')].join(':').toLowerCase()}`,
      new Criterion((tileYield) => tileYield instanceof Yield),
      new Criterion((tileYield, tile) => tile.terrain instanceof Terrain),
      new Criterion((tileYield, tile) => TileImprovementRegistry.getBy('tile', tile)
        .some((improvement) => improvement instanceof Improvement)
      ),
      new Criterion((tileYield, tile, player) => {
        const [playerGovernment] = PlayerGovernmentRegistry.getBy('player', player);

        if (playerGovernment) {
          return playerGovernment.is(...Governments);
        }

        return false;
      }),
      new Effect((tileYield) => tileYield.add(value))
    ));
  })
;
