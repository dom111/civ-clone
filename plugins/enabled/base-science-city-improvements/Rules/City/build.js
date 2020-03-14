import {
  Aqueduct,
  CityWalls,
  Colosseum,
  Courthouse,
  Granary,
  Library,
  Marketplace,
  Palace,
  Temple,
} from '../../../base-city-improvements/CityImprovements.js';
import {
  CeremonialBurial,
  CodeOfLaws,
  Construction,
  Currency,
  Masonry,
  Pottery,
  Writing,
} from '../../../base-science/Advances.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import PlayerResearchRegistry from '../../../base-science/PlayerResearchRegistry.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = ({
  playerResearchRegistry = PlayerResearchRegistry.getInstance(),
} = {}) => [
  ...[
    [Aqueduct, Construction],
    [CityWalls, Masonry],
    [Colosseum, Construction],
    [Courthouse, CodeOfLaws],
    [Granary, Pottery],
    [Library, Writing],
    [Marketplace, Currency],
    [Palace, Masonry],
    [Temple, CeremonialBurial],
  ]
    .map(([Unit, Advance]) => new Rule(
      `city:build:improvement:${[Unit, Advance].map((entity) => entity.name.toLowerCase()).join(':')}`,
      new Criterion((city, buildItem) => buildItem === Unit),
      new Effect((city) => new Criterion(() => playerResearchRegistry
        .getBy('player', city.player)
        .every((playerResearch) => playerResearch.completed(Advance))
      ))
    ))
  ,
];

export default getRules;
