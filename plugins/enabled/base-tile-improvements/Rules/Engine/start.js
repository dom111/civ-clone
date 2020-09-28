import Effect from '../../../core-rules/Effect.js';
import {High} from '../../../core-rules/Priorities.js';
import Rule from '../../../core-rules/Rule.js';
import Tile from '../../../core-world/Tile.js';
import TileImprovementRegistry from '../../../core-registry/Registry.js';

export const getRules = ({
  tileImprovementRegistry = TileImprovementRegistry.getInstance(),
} = {}) => [
  new Rule(
    'engine:start:tile-additional-data',
    new High(),
    new Effect(() => {
      [
        ['improvements', {
          value() {
            return tileImprovementRegistry.getBy('tile', this);
          },
        }],
      ]
        .forEach(([key, value]) => {
          if (Object.prototype.hasOwnProperty.call(Tile.prototype, key)) {
            throw new TypeError(`'${key}' already exists in 'Tile.prototype'.`);
          }

          Object.defineProperty(Tile.prototype, key, {
            configurable: false,
            enumerable: true,
            writable: false,
            ...value,
          });
        })
      ;
    })
  ),
];

export default getRules;
