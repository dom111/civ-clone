import RulesRegistry from '../core-rules/RulesRegistry.js';
import celebrateLeader from './Rules/City/celebrate-leader.js';
import cityYield from './Rules/City/yield.js';
import civilDisorder from './Rules/City/civil-disorder.js';
import cost from './Rules/City/cost.js';
import turnStart from './Rules/Player/turn-start.js';

RulesRegistry.getInstance()
  .register(
    ...celebrateLeader(),
    ...cityYield(),
    ...civilDisorder(),
    ...cost(),
    ...turnStart()
  )
;
