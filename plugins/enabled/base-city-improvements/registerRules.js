import RulesRegistry from '../core-rules-registry/RulesRegistry.js';
import engineStart from './Rules/Engine/start.js';
import improvementCreated from './Rules/City/improvement-created.js';

RulesRegistry.getInstance()
  .register(
    ...engineStart(),
    ...improvementCreated()
  )
;