import RulesRegistry from '../core-rules-registry/RulesRegistry.js';
import goodyHutAction from './Rules/GoodyHut/action.js';

RulesRegistry.getInstance()
  .register(
    ...goodyHutAction()
  )
;
