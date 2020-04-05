import RulesRegistry from '../../../core-rules-registry/RulesRegistry.js';

engine.on('engine:start', () => RulesRegistry.getInstance()
  .process('engine:start')
);
