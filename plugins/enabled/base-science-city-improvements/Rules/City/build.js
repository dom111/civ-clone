import {Aqueduct, CityWalls, Courthouse, Granary, Library, Marketplace, Palace, Temple} from '../../../base-city-improvements/CityImprovements.js';
import {CeremonialBurial, CodeOfLaws, Construction, Currency, Masonry, Pottery, Writing} from '../../../base-science/Advances.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import PlayerResearchRegistry from '../../../base-science/PlayerResearchRegistry.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';

[
  [Aqueduct, Construction],
  [CityWalls, Masonry],
  [Courthouse, CodeOfLaws],
  [Granary, Pottery],
  [Library, Writing],
  [Marketplace, Currency],
  [Palace, Masonry],
  [Temple, CeremonialBurial],
]
  .forEach(([Unit, Advance]) => {
    RulesRegistry.register(new Rule(
      `city:build:improvement:${[Unit, Advance].map((entity) => entity.name.toLowerCase()).join(':')}`,
      new Criterion((city, buildItem) => buildItem === Unit),
      new Effect((city) => new Criterion(() => PlayerResearchRegistry
        .getBy('player', city.player)
        .every((playerResearch) => playerResearch.completed(Advance))
      ))
    ));
  })
;
