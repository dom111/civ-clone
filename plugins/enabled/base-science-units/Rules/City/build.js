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
  Sail,
  Spearman,
  Swordman,
  Trireme,
} from '../../../base-unit/Units.js';
import Criteria from '../../../core-rules/Criteria.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import OneCriteria from '../../../core-rules/OneCriteria.js';
import PlayerResearchRegistry from '../../../base-player-science/PlayerResearchRegistry.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';

[
  [Catapult, Mathematics],
  [Cavalry, HorsebackRiding, Gunpowder],
  [Chariot, TheWheel, Chivalry],
  [Knights, Chivalry],
  [Militia, false, Gunpowder],
  [Musketman, Gunpowder],
  [Sail, Navigation],
  [Spearman, BronzeWorking, Gunpowder],
  [Swordman, IronWorking],
  [Trireme, MapMaking, Navigation],
]
  .forEach(([Unit, RequiredAdvance, ObseletionAdvance]) => {
    RulesRegistry.register(new Rule(
      `city:build:unit:${[Unit, RequiredAdvance, ObseletionAdvance].map((entity) => entity ? entity.name.toLowerCase() : 'none').join(':')}`,
      new Criterion((city, buildItem) => buildItem === Unit),
      new Effect((city) => new Criteria(
        new OneCriteria(
          new Criterion(() => ! RequiredAdvance),
          new Criterion(() => PlayerResearchRegistry
            .getBy('player', city.player)
            .every((playerResearch) => playerResearch.hasCompleted(RequiredAdvance))
          )
        ),
        new OneCriteria(
          new Criterion(() => ! ObseletionAdvance),
          new Criterion(() => ! PlayerResearchRegistry
            .getBy('player', city.player)
            .every((playerResearch) => playerResearch.hasCompleted(ObseletionAdvance))
          )
        )
      ))
    ));
  })
;
