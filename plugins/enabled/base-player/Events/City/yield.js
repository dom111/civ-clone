import RulesRegistry from '../../../core-rules/RulesRegistry.js';

engine.on('city:yield', (cityYield, city) => RulesRegistry.get('city:process-yield')
  .filter((rule) => rule.validate(cityYield, city))
  .forEach((rule) => rule.process(cityYield, city))
);
