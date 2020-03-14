import RulesRegistry from '../core-rules/RulesRegistry.js';
import availability from './Rules/Governments/availability.js';
import governmentChanged from './Rules/Player/government-changed.js';

RulesRegistry.getInstance()
  .register(
    ...availability(),
    ...governmentChanged()
  )
;
