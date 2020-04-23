import Effect from '../../../core-rules/Effect.js';
import {High} from '../../../core-rules/Priorities.js';
import Rule from '../../../core-rules/Rule.js';
import Unit from '../../../core-unit/Unit.js';
import UnitImprovementRegistry from '../../../core-registry/Registry.js';

export const getRules = ({
  unitImprovementRegistry = UnitImprovementRegistry.getInstance(),
} = {}) => [
  new Rule(
    'engine:start:unit-additional-data',
    new High(),
    new Effect(() => {
      [
        ['improvements', {
          value() {
            return unitImprovementRegistry.getBy('unit', this);
          },
        }],
      ]
        .forEach(([key, value]) => {
          if (Object.prototype.hasOwnProperty.call(Unit.prototype, key)) {
            throw new TypeError(`'${key}' already exists in 'Unit.prototype'.`);
          }

          Object.defineProperty(Unit.prototype, key, {
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
