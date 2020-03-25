import {
  Astronomy,
  BronzeWorking,
  Literacy,
  MapMaking,
  Masonry,
  Mysticism,
  Navigation,
  Pottery,
} from '../../../base-science/Advances.js';
import {
  Colossus,
  CopernicusObservatory,
  GreatLibrary,
  GreatWall,
  HangingGardens,
  Lighthouse,
  MagellansExpedition,
  Oracle,
  Pyramids,
} from '../../../base-wonder/Wonders.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import PlayerResearchRegistry from '../../../base-science/PlayerResearchRegistry.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = ({
  playerResearchRegistry = PlayerResearchRegistry.getInstance(),
} = {}) => [
  ...[
    [Colossus, BronzeWorking],
    [CopernicusObservatory, Astronomy],
    [GreatLibrary, Literacy],
    [GreatWall, Masonry],
    [HangingGardens, Pottery],
    [Lighthouse, MapMaking],
    [MagellansExpedition, Navigation],
    [Oracle, Mysticism],
    [Pyramids, Masonry],
  ]
    .map(([Wonder, RequiredAdvance]) => new Rule(
      `city:build:unit:${[Wonder, RequiredAdvance].map((entity) => entity ? entity.name.toLowerCase() : 'none').join(':')}`,
      new Criterion((city, buildItem) => buildItem === Wonder),
      new Effect((city) => new Criterion(() => playerResearchRegistry
        .getBy('player', city.player())
        .some((playerResearch) => playerResearch.completed(RequiredAdvance))
      ))
    ))
  ,
];

export default getRules;
