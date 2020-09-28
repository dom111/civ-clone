import {
  BronzeWorking,
  Chivalry,
  Gunpowder,
  HorsebackRiding,
  IronWorking,
  MapMaking,
  Mathematics,
  Navigation,
  TheWheel,
} from '../../../base-science/Advances.js';
import {
  Catapult,
  Chariot,
  Horseman,
  Knight,
  Musketman,
  Spearman,
  Swordman,
  Warrior,
} from '../../../base-units-civ1/Units.js';
import {
  Sail,
  Trireme,
} from '../../../base-unit-transport/Units.js';
import And from '../../../core-rules/Criteria/And.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Or from '../../../core-rules/Criteria/Or.js';
import PlayerResearchRegistry from '../../../base-science/PlayerResearchRegistry.js';
import Rule from '../../../core-rules/Rule.js';

// export const getRules = (Unit, RequiredAdvance, ObseletionAdvance, {
//   playerResearchRegistry = PlayerResearchRegistry.getInstance(),
// } = {}) => [
//   new Rule(
//     `city:build:unit:${[Unit, RequiredAdvance, ObseletionAdvance].map((Entity) => Entity ? Entity.name.toLowerCase() : 'none').join(':')}`,
//     new Criterion((city, BuildItem) => BuildItem === Unit),
//     new Effect((city) => new And(
//       new Or(
//         new Criterion(() => ! RequiredAdvance),
//         new Criterion(() => playerResearchRegistry
//           .getBy('player', city.player())
//           .some((playerResearch) => playerResearch.completed(RequiredAdvance))
//         )
//       ),
//       new Or(
//         new Criterion(() => ! ObseletionAdvance),
//         new Criterion(() => ! playerResearchRegistry
//           .getBy('player', city.player())
//           .some((playerResearch) => playerResearch.completed(ObseletionAdvance))
//         )
//       )
//     ))
//   )
// ];

export const getRules = ({
  playerResearchRegistry = PlayerResearchRegistry.getInstance(),
} = {}) => [
  ...[
    [Catapult, Mathematics],
    [Horseman, HorsebackRiding, Gunpowder],
    [Chariot, TheWheel, Chivalry],
    [Knight, Chivalry],
    [Warrior, null, Gunpowder],
    [Musketman, Gunpowder],
    [Sail, Navigation],
    [Spearman, BronzeWorking, Gunpowder],
    [Swordman, IronWorking],
    [Trireme, MapMaking, Navigation],
  ]
    .map(([Unit, RequiredAdvance, ObseletionAdvance]) => new Rule(
      `city:build:unit:${[Unit, RequiredAdvance, ObseletionAdvance].map((entity) => entity ? entity.name.toLowerCase() : 'none').join(':')}`,
      new Criterion((city, buildItem) => buildItem === Unit),
      new Effect((city) => new And(
        new Or(
          new Criterion(() => ! RequiredAdvance),
          new Criterion(() => playerResearchRegistry
            .getBy('player', city.player())
            .some((playerResearch) => playerResearch.completed(RequiredAdvance))
          )
        ),
        new Or(
          new Criterion(() => ! ObseletionAdvance),
          new Criterion(() => ! playerResearchRegistry
            .getBy('player', city.player())
            .some((playerResearch) => playerResearch.completed(ObseletionAdvance))
          )
        )
      ))
    ))
  ,
];

export default getRules;
