import {
  BronzeWorking,
  HorsebackRiding,
  IronWorking,
  MapMaking,
  Mathematics,
} from '../../base-science/Advances.js';
import {
  Catapult,
  Cavalry,
  Spearman,
  Swordman,
  Trireme,
} from '../../base-unit/Units.js';
import Criterion from '../../core-rules/Criterion.js';
import Effect from '../../core-rules/Effect.js';
import PlayerResearchRegistry from '../../base-player-science/PlayerResearchRegistry.js';
import Rule from '../../core-rules/Rule.js';
import RulesRegistry from '../../core-rules/RulesRegistry.js';

[
  [Catapult, Mathematics],
  [Cavalry, HorsebackRiding],
  [Spearman, BronzeWorking],
  [Swordman, IronWorking],
  [Trireme, MapMaking],
]
  .forEach(([Unit, Advance]) => {
    RulesRegistry.register(new Rule(
      `city:build:unit:${[Unit, Advance].map((entity) => entity.name.toLowerCase()).join(':')}`,
      new Criterion((city, buildItem) => buildItem === Unit),
      new Effect((city) => new Criterion(() => PlayerResearchRegistry
        .getBy('player', city.player)
        .every((playerResearch) => playerResearch.hasCompleted(Advance))
      ))
    ));
  })
;
