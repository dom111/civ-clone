import RulesRegistry from '../core-rules/RulesRegistry.js';
import improvementCreated from './Rules/City/improvement-created.js';

RulesRegistry.getInstance()
  .register(
    ...improvementCreated()
  )
;