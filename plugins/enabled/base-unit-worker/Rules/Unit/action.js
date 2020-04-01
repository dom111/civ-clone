import {
  BuildIrrigation,
  BuildMine,
  BuildRoad,
  ClearForest,
  ClearJungle,
  ClearSwamp,
  PlantForest,
} from '../../Actions.js';
import {Forest, Jungle, Plains, River, Swamp} from '../../../base-terrain/Terrains.js';
import {Irrigation, Mine, Road} from '../../../base-tile-improvements/TileImprovements.js';
import CityRegistry from '../../../core-city/CityRegistry.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Or from '../../../core-rules/Criteria/Or.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';
import TileImprovementRegistry from '../../../core-tile-improvements/TileImprovementRegistry.js';
import {Worker} from '../../../base-unit/Types/Worker.js';
import {hasEnoughMovesLeft} from '../../../base-unit/Rules/Unit/action.js';

export const getRules = ({
  cityRegistry = CityRegistry.getInstance(),
  rulesRegistry = RulesRegistry.getInstance(),
  tileImprovementRegistry = TileImprovementRegistry.getInstance(),
} = {}) => {
  return [
    ...[
      [Irrigation, BuildIrrigation, new Or(
        new Criterion((unit, to, from = unit.tile()) => from.terrain() instanceof River),
        new Criterion((unit, to, from = unit.tile()) => from.isCoast()),
        new Criterion((unit, to, from = unit.tile()) => from.getAdjacent()
          .some((tile) => tile.terrain() instanceof River ||
            (
              tileImprovementRegistry.getBy('tile', tile)
                .some((improvement) => improvement instanceof Irrigation) &&
              ! cityRegistry.getBy('tile', tile)
                .length
            )
          )
        )
      )],
      [Mine, BuildMine],
      [Road, BuildRoad],
    ]
      .map(([Improvement, Action, ...additionalCriteria]) => new Rule(
        `unit:action:${Action.name.replace(/^./, (char) => char.toLowerCase())}`,
        new Criterion((unit) => unit instanceof Worker),
        hasEnoughMovesLeft,
        new Criterion((unit, to, from = unit.tile()) => rulesRegistry.get('tile:improvement:available')
          .some((rule) => rule.validate(from, Improvement, unit.player()))
        ),
        new Criterion((unit, to, from = unit.tile()) => from === to),
        new Criterion((unit) => ! tileImprovementRegistry.getBy('tile', unit.tile())
          .some((improvement) => improvement instanceof Improvement)
        ),
        new Effect((unit, to, from = unit.tile()) => new Action({unit, to, from, rulesRegistry})),
        ...additionalCriteria
      ))
    ,

    ...[
      [Jungle, ClearJungle],
      [Forest, ClearForest],
      [Plains, PlantForest],
      [Swamp, ClearSwamp],
    ]
      .map(([Terrain, Action]) => new Rule(
        `unit:action:${Action.name.replace(/^./, (c) => c.toLowerCase())}`,
        hasEnoughMovesLeft,
        new Criterion((unit) => unit instanceof Worker),
        new Criterion((unit, to, from = unit.tile()) => to === from),
        new Criterion((unit, to, from = unit.tile()) => from.terrain() instanceof Terrain),
        new Effect((unit, to, from = unit.tile()) => new Action({unit, to, from, rulesRegistry}))
      )),
  ];
};

export default getRules;
