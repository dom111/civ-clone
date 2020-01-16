import City from '../core-city/City.js';
import Rules from '../core-rules/Rules.js';

engine.on('city:destroyed', (city, player) => {
  city.destroyed = {
    // turn: engine.turn, // TODO: import Time and use Time.turn
    by: player,
  };
});

engine.on('city:grow', (city) => {
  Rules.get('city:grow')
    .forEach((rule) => {
      if (rule.validate(city)) {
        rule.process(city);
      }
    })
  ;
  city.size++;
  city.foodStorage = 0;
  city.autoAssignWorkers();
});

engine.on('city:shrink', (city) => {
  city.size--;
  city.foodStorage = 0;
  city.autoAssignWorkers();
});

engine.on('unit:registered', (unit) => {
  City.registerBuildUnit(unit);
});

engine.on('city-improvement:registered', (improvement) => {
  City.registerBuildImprovement(improvement);
});