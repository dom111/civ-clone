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

RulesRegistry.register(new Rule(
  'city:build:unit:catapult:mathematics',
  new Criterion((city, buildItem) => buildItem === Catapult),
  new Effect((city) => new Criterion(() => PlayerResearchRegistry
    .filter((playerResearch) => playerResearch.player === city.player)
    .every((playerResearch) => playerResearch.hasCompleted(Mathematics))
  ))
));
RulesRegistry.register(new Rule(
  'city:build:unit:cavalry:horsebackriding',
  new Criterion((city, buildItem) => buildItem === Cavalry),
  new Effect((city) => new Criterion(() => PlayerResearchRegistry
    .filter((playerResearch) => playerResearch.player === city.player)
    .every((playerResearch) => playerResearch.hasCompleted(HorsebackRiding))
  ))
));
RulesRegistry.register(new Rule(
  'city:build:unit:spearman:bronzeworking',
  new Criterion((city, buildItem) => buildItem === Spearman),
  new Effect((city) => new Criterion(() => PlayerResearchRegistry
    .filter((playerResearch) => playerResearch.player === city.player)
    .every((playerResearch) => playerResearch.hasCompleted(BronzeWorking))
  ))
));
RulesRegistry.register(new Rule(
  'city:build:unit:swordman:ironworking',
  new Criterion((city, buildItem) => buildItem === Swordman),
  new Effect((city) => new Criterion(() => PlayerResearchRegistry
    .filter((playerResearch) => playerResearch.player === city.player)
    .every((playerResearch) => playerResearch.hasCompleted(IronWorking))
  ))
));
RulesRegistry.register(new Rule(
  'city:build:unit:trireme:mapmaking',
  new Criterion((city, buildItem) => buildItem === Trireme),
  new Effect((city) => new Criterion(() => PlayerResearchRegistry
    .filter((playerResearch) => playerResearch.player === city.player)
    .every((playerResearch) => playerResearch.hasCompleted(MapMaking))
  ))
));
