import {Effect} from '../../../core-rules/Effect.js';
import {Happiness} from '../../../base-city-happiness/Yields.js';
import {Luxuries} from '../../Yields.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';

RulesRegistry.register(new Rule(
  'city:happiness:luxuries',
  new Effect((city) => new Happiness(...city.yields()
    .filter((cityYield) => cityYield instanceof Luxuries)
    .map((cityYield) => Math.floor(cityYield.value() / 2))
  ))
));
