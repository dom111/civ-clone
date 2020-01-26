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
import Rules from '../../core-rules/Rules.js';

Rules.register(new Rule(
  'city:build:unit:spearman:bronzeworking',
  new Criterion((city, buildItem) => buildItem === Catapult),
  new Effect((city) => new Criterion(() => PlayerResearchRegistry.entries()
    .filter((playerResearch) => playerResearch.player === city.player)
    .every((playerResearch) => playerResearch.hasCompleted(Mathematics))
  ))
));
Rules.register(new Rule(
  'city:build:unit:spearman:bronzeworking',
  new Criterion((city, buildItem) => buildItem === Cavalry),
  new Effect((city) => new Criterion(() => PlayerResearchRegistry.entries()
    .filter((playerResearch) => playerResearch.player === city.player)
    .every((playerResearch) => playerResearch.hasCompleted(HorsebackRiding))
  ))
));
Rules.register(new Rule(
  'city:build:unit:spearman:bronzeworking',
  new Criterion((city, buildItem) => buildItem === Spearman),
  new Effect((city) => new Criterion(() => PlayerResearchRegistry.entries()
    .filter((playerResearch) => playerResearch.player === city.player)
    .every((playerResearch) => playerResearch.hasCompleted(BronzeWorking))
  ))
));
Rules.register(new Rule(
  'city:build:unit:swordman:bronzeworking',
  new Criterion((city, buildItem) => buildItem === Swordman),
  new Effect((city) => new Criterion(() => PlayerResearchRegistry.entries()
    .filter((playerResearch) => playerResearch.player === city.player)
    .every((playerResearch) => playerResearch.hasCompleted(IronWorking))
  ))
));
Rules.register(new Rule(
  'city:build:unit:swordman:bronzeworking',
  new Criterion((city, buildItem) => buildItem === Trireme),
  new Effect((city) => new Criterion(() => PlayerResearchRegistry.entries()
    .filter((playerResearch) => playerResearch.player === city.player)
    .every((playerResearch) => playerResearch.hasCompleted(MapMaking))
  ))
));
