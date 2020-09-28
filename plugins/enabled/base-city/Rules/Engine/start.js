import City from '../../../core-city/City.js';
import CityBuildRegistry from '../../CityBuildRegistry.js';
import CityGrowthRegistry from '../../../core-registry/Registry.js';
import Effect from '../../../core-rules/Effect.js';
import {High} from '../../../core-rules/Priorities.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = ({
  cityBuildRegistry = CityBuildRegistry.getInstance(),
  cityGrowthRegistry = CityGrowthRegistry.getInstance(),
} = {}) => [
  new Rule(
    'engine:start:city-additional-data',
    new High(),
    new Effect(() => {
      [
        ['build', {
          value() {
            const [cityBuild] = cityBuildRegistry.getBy('city', this);

            return cityBuild;
          },
        }],
        ['growth', {
          value() {
            const [cityGrowth] = cityGrowthRegistry.getBy('city', this);

            return cityGrowth;
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
