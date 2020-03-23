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
  Cavalry,
  Chariot,
  Knights,
  Militia,
  Musketman,
  Spearman,
  Swordman,
} from '../../../base-unit/Units.js';
import {
  Sail,
  Trireme,
} from '../../../base-unit-transport/Units.js';
import Criteria from '../../../core-rules/Criteria.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import OneCriteria from '../../../core-rules/OneCriteria.js';
import PlayerResearchRegistry from '../../../base-science/PlayerResearchRegistry.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = ({
  playerResearchRegistry = PlayerResearchRegistry.getInstance(),
} = {}) => [
  ...[
    [Catapult, Mathematics],
    [Cavalry, HorsebackRiding, Gunpowder],
    [Chariot, TheWheel, Chivalry],
    [Knights, Chivalry],
    [Militia, null, Gunpowder],
    [Musketman, Gunpowder],
    [Sail, Navigation],
    [Spearman, BronzeWorking, Gunpowder],
    [Swordman, IronWorking],
    [Trireme, MapMaking, Navigation],
  ]
    .map(([Unit, RequiredAdvance, ObseletionAdvance]) => new Rule(
      `city:build:unit:${[Unit, RequiredAdvance, ObseletionAdvance].map((entity) => entity ? entity.name.toLowerCase() : 'none').join(':')}`,
      new Criterion((city, buildItem) => buildItem === Unit),
      new Effect((city) => new Criteria(
        new OneCriteria(
          new Criterion(() => ! RequiredAdvance),
          new Criterion(() => playerResearchRegistry
            .getBy('player', city.player())
            .every((playerResearch) => playerResearch.completed(RequiredAdvance))
          )
        ),
        new OneCriteria(
          new Criterion(() => ! ObseletionAdvance),
          new Criterion(() => ! playerResearchRegistry
            .getBy('player', city.player())
            .every((playerResearch) => playerResearch.completed(ObseletionAdvance))
          )
        )
      ))
    ))
  ,
];

export default getRules;
