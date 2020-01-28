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
import Rules from '../../core-rules/Rules.js';

Rules.register(new Rule(
  'terrain:feature:coal',
  new Criterion((TerrainFeature) => TerrainFeature === Coal),
  new Criterion((TerrainFeature, Terrain) => Terrain === Hills),
  new Effect(() => Math.random() <= .06)
));
Rules.register(new Rule(
  'terrain:feature:fish',
  new Criterion((TerrainFeature) => TerrainFeature === Fish),
  new Criterion((TerrainFeature, Terrain) => Terrain === Ocean),
  new Effect(() => Math.random() <= .06)
));
Rules.register(new Rule(
  'terrain:feature:game',
  new Criterion((TerrainFeature) => TerrainFeature === Game),
  new Criterion((TerrainFeature, Terrain) => [Forest, Tundra].includes(Terrain)),
  new Effect(() => Math.random() <= .06)
));
Rules.register(new Rule(
  'terrain:feature:gems',
  new Criterion((TerrainFeature) => TerrainFeature === Gems),
  new Criterion((TerrainFeature, Terrain) => Terrain === Jungle),
  new Effect(() => Math.random() <= .06)
));
Rules.register(new Rule(
  'terrain:feature:gold',
  new Criterion((TerrainFeature) => TerrainFeature === Gold),
  new Criterion((TerrainFeature, Terrain) => Terrain === Mountains),
  new Effect(() => Math.random() <= .06)
));
Rules.register(new Rule(
  'terrain:feature:horse',
  new Criterion((TerrainFeature) => TerrainFeature === Horse),
  new Criterion((TerrainFeature, Terrain) => Terrain === Plains),
  new Effect(() => Math.random() <= .06)
));
Rules.register(new Rule(
  'terrain:feature:oasis',
  new Criterion((TerrainFeature) => TerrainFeature === Oasis),
  new Criterion((TerrainFeature, Terrain) => Terrain === Desert),
  new Effect(() => Math.random() <= .06)
));
Rules.register(new Rule(
  'terrain:feature:oil',
  new Criterion((TerrainFeature) => TerrainFeature === Oil),
  new Criterion((TerrainFeature, Terrain) => Terrain === Swamp),
  new Effect(() => Math.random() <= .06)
));
Rules.register(new Rule(
  'terrain:feature:seal',
  new Criterion((TerrainFeature) => TerrainFeature === Seal),
  new Criterion((TerrainFeature, Terrain) => Terrain === Arctic),
  new Effect(() => Math.random() <= .06)
));
Rules.register(new Rule(
  'terrain:feature:shield',
  new Criterion((TerrainFeature) => TerrainFeature === Shield),
  new Criterion((TerrainFeature, Terrain) => [Grassland, River].includes(Terrain)),
  new Effect(() => Math.random() <= .5)
));
