import RulesRegistry from '../../../core-rules/RulesRegistry.js';

engine.on('city:grow', (city) => {
  RulesRegistry.get('city:grow')
    .forEach((rule) => {
      if (rule.validate(city)) {
        rule.process(city);
      }
    })
  ;

  city.size++;
  city.foodStorage = 0;
  city.assignUnassignedWorkers();
});
