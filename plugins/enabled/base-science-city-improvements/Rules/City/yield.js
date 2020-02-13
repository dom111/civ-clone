import CityImprovementRegistry from '../../../core-city-improvement/CityImprovementRegistry.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import {Library} from '../../../base-city-improvements/Improvements.js';
import {Library as LibraryModifier} from '../../YieldModifier/Library.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';
import {Science} from '../../../base-science/Yields.js';

RulesRegistry.register(new Rule(
  'city:yield:science:library',
  new Criterion((cityYield) => cityYield instanceof Science),
  new Criterion((cityYield, city) => CityImprovementRegistry.getBy('city', city)
    .some((improvement) => improvement instanceof Library)
  ),
  new Effect((cityYield) => cityYield.addModifier(new LibraryModifier()))
));
