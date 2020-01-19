import {Arctic, Desert, Forest, Grassland, Hills, Jungle, Mountains, Ocean, Plains, River, Swamp, Tundra} from '../../Terrains.js';
import Effect from '../../../core-rules/Effect.js';
import Registry from '../../Registry.js';
import Rule from '../../../core-rules/Rule.js';
import Rules from '../../../core-rules/Rules.js';

const rootTerrains = [
    Ocean,
    Grassland,
  ],
  baseTerrains = [
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
  ]
;

Rules.register(new Rule(
  'terrain:distributionGroups:root',
  // first pass (root terrain types)
  new Effect(() => rootTerrains)
));
Rules.register(new Rule(
  'terrain:distributionGroups:base',
  // first pass (base terrain types)
  new Effect(() => baseTerrains)
));
Rules.register(new Rule(
  'terrain:distributionGroups:special',
  // second pass (special terrain types)
  new Effect(() => Registry.filter((entity) => [...rootTerrains, ...baseTerrains].includes(entity.__proto__)))
));