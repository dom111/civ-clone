import {
  Arctic,
  Desert,
  Forest,
  Grassland,
  Hills,
  Jungle,
  Mountains,
  Plains,
  River,
  Swamp,
  Tundra,
} from '../../../base-terrain/Terrains.js';
import {Irrigation, Mine, Road} from '../../TileImprovements.js';
import {BridgeBuilding} from '../../../base-science/Advances.js';
import Criterion from '../../../core-rules/Criterion.js';
import PlayerResearchRegistry from '../../../base-science/PlayerResearchRegistry.js';
import Rule from '../../../core-rules/Rule.js';
import TileImprovementRegistry from '../../../core-tile-improvements/TileImprovementRegistry.js';

export const getRules = ({
  playerResearchRegistry = PlayerResearchRegistry.getInstance(),
  tileImprovementRegistry = TileImprovementRegistry.getInstance(),
} = {}) => [
  ...[
    [Irrigation, Desert, Grassland, Hills, Plains, River],
    [Mine, Desert, Hills, Mountains],
    [Road, Arctic, Desert, Forest, Grassland, Hills, Jungle, Mountains, Plains, Swamp, Tundra],
  ]
    .map(([Improvement, ...Terrains]) => new Rule(
      `tile:improvement:available:${Improvement.name.toLowerCase()}`,
      new Criterion((tile, TileImprovement) => TileImprovement === Improvement),
      new Criterion((tile, TileImprovement) => ! tileImprovementRegistry.getBy('tile', tile)
        .some((improvement) => improvement instanceof TileImprovement)
      ),
      new Criterion((tile) => Terrains.some((Terrain) => tile.terrain() instanceof Terrain))
    )),

  ...[
    [Road, BridgeBuilding, River],
  ]
    .map(([Improvement, Advance, Terrain]) => new Rule(
      `tile:improvement:available:${[Improvement, Terrain].map((Entity) => Entity.name.toLowerCase()).join(':')}`,
      new Criterion((tile, TileImprovement) => TileImprovement === Improvement),
      new Criterion((tile, TileImprovement, player) => playerResearchRegistry.getBy('player', player)
        .some((playerResearch) => playerResearch.completed(Advance))
      ),
      new Criterion((tile) => tile.terrain() instanceof Terrain)
    )),
];

export default getRules;
