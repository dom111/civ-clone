import RulesRegistry from '../core-rules/RulesRegistry.js';
import cityBuildCost from './Rules/City/build-cost.js';
import cityCost from './Rules/City/cost.js';
import cityGrow from './Rules/City/grow.js';

RulesRegistry.getInstance()
  .register(
    ...cityBuildCost(),
    ...cityCost(),
    ...cityGrow()
  )
;
