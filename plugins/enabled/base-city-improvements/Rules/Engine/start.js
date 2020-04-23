import City from '../../../core-city/City.js';
import CityImprovementRegistry from '../../../core-city-improvement/CityImprovementRegistry.js';
import Effect from '../../../core-rules/Effect.js';
import {High} from '../../../core-rules/Priorities.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = ({
  cityImprovementRegistry = CityImprovementRegistry.getInstance(),
} = {}) => [
  new Rule(
    'engine:start:city-additional-data',
    new High(),
    new Effect(() => {
      [
        ['improvements', {
          value() {
            const [cityImprovements] = cityImprovementRegistry.getBy('city', this);

            return cityImprovements;
          },
        }],
      ]
        .forEach(([key, value]) => {
          if (Object.prototype.hasOwnProperty.call(City.prototype, key)) {
            throw new TypeError(`'${key}' already exists in 'City.prototype'.`);
          }

          Object.defineProperty(City.prototype, key, {
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
