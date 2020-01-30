import {
  Arctic,
  Desert,
  Forest,
  Grassland,
  Hills,
  Jungle,
  Mountains,
  Ocean,
  Plains,
  River,
  Swamp,
  Tundra,
} from '../../base-terrain/Terrains.js';
import {Coal, Fish, Game, Gems, Gold, Horse, Oasis, Oil, Seal, Shield} from '../TerrainFeatures.js';
import Criterion from '../../core-rules/Criterion.js';
import Effect from '../../core-rules/Effect.js';
import Rule from '../../core-rules/Rule.js';
import RulesRegistry from '../../core-rules/RulesRegistry.js';

const baseChance = .06;

[
  [Coal, baseChance, Hills],
  [Fish, baseChance, Ocean],
  [Game, baseChance, Forest, Tundra],
  [Gems, baseChance, Jungle],
  [Gold, baseChance, Mountains],
  [Horse, baseChance, Plains],
  [Oasis, baseChance, Desert],
  [Oil, baseChance, Swamp],
  [Seal, baseChance, Arctic],
  [Shield, .5, Grassland, River],
]
  .forEach(([Feature, chance, ...terrains]) => {
    RulesRegistry.register(new Rule(
      `terrain:feature:${Feature.name.toLowerCase()}`,
      new Criterion((TerrainFeature) => TerrainFeature === Feature),
      new Criterion((TerrainFeature, Terrain) => terrains.includes(Terrain)),
      new Effect(() => Math.random() <= chance)
    ));
  })
;
