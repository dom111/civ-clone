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
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = () => [
  new Rule(
    'terrain:distributionGroups:core',
    // first pass (root terrain types)
    new Effect(() => [
      Ocean,
      Grassland,
      Swamp,
      Mountains,
      Jungle,
      Hills,
      Forest,
      Desert,
      Plains,
      Tundra,
      Arctic,
      River,
    ])
  ),
];

export default getRules;
