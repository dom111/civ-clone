import Criterion from '../../../core-rules/Criterion.js';
import GoodyHutRegistry from '../../../core-goody-huts/GoodyHutRegistry.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = ({
  goodyHutRegistry = GoodyHutRegistry.getInstance(),
} = {}) => [
  new Rule(
    'tile:goody-hut:land-only',
    new Criterion((tile) => tile.isLand())
  ),
  new Rule(
    'tile:goody-hut:no-nearby-huts',
    new Criterion((tile) => tile.getSurroundingArea(3)
      .every((tile) => goodyHutRegistry.getBy('tile', tile)
        .length === 0
      )
    )
  ),
  new Rule(
    'tile:goody-hut:chance',
    new Criterion(() => Math.random() < .05)
  ),
];

export default getRules;
