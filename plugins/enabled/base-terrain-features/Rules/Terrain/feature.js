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
} from '../../../base-terrain/Terrains.js';
import {Coal, Fish, Game, Gems, Gold, Horse, Oasis, Oil, Seal, Shield} from '../../TerrainFeatures.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import OneCriteria from '../../../core-rules/OneCriteria.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = () => {
  const baseChance = .2;

  return [
    ...[
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
      .map(([Feature, chance, ...terrains]) => new Rule(
        `terrain:feature:${Feature.name.toLowerCase()}`,
        new Criterion((TerrainFeature) => TerrainFeature === Feature),
        new OneCriteria(
          new Criterion((TerrainFeature, Terrain) => terrains.includes(Terrain)),
          new Criterion((TerrainFeature, terrain) => terrains.some((Terrain) => terrain instanceof Terrain))
        ),
        new Criterion(() => Math.random() <= chance),
        new Effect((TerrainFeature, terrain) => terrain.features.push(new TerrainFeature()))
      ))
    ,
  ];
};

export default getRules;
