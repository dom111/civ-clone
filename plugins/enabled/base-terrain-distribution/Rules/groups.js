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
import Effect from '../../core-rules/Effect.js';
import Rule from '../../core-rules/Rule.js';
import RulesRegistry from '../../core-rules/RulesRegistry.js';

RulesRegistry.register(new Rule(
  'terrain:distributionGroups:root',
  // first pass (root terrain types)
  new Effect(() => [
    Ocean,
    Grassland,
  ])
));
RulesRegistry.register(new Rule(
  'terrain:distributionGroups:base',
  // first pass (terrain types)
  new Effect(() => [
    Arctic,
    Desert,
    Forest,
    Hills,
    Jungle,
    Mountains,
    Plains,
    River,
    Swamp,
    Tundra,
  ])
));
