import RulesRegistry from '../../../core-rules/RulesRegistry.js';

engine.on('city:building-complete', (city, item) => {
  RulesRegistry.get('city:building-complete')
    .forEach((rule) => {
      if (rule.validate(city, item)) {
        rule.process(city, item);
      }
    })
  ;
});
