import {Happiness, Unhappiness} from '../../Yields.js';
import Criterion from '../../../core-rules/Criterion.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = () => [
  new Rule(
    'city:civil-disorder:default',
    new Criterion((city, yields = city.yields()) => {
      const happiness = yields.filter((citizenState) => citizenState instanceof Happiness)
          .reduce((total, happiness) => total + happiness.value(), 0),
        unhappiness = yields.filter((citizenState) => citizenState instanceof Unhappiness)
          .reduce((total, unhappiness) => total + unhappiness.value(), 0)
      ;

      return unhappiness > happiness;
    })
  ),
];

export default getRules;
