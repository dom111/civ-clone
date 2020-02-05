import {Irrigation, Road} from '../base-terrain-improvements/Improvements.js';
import CityRegistry from '../core-city/CityRegistry.js';
import RulesRegistry from '../core-rules/RulesRegistry.js';
import Time from '../core-turn-based-game/Time.js';

engine.on('city:created', (city) => {
  engine.emit('tile:improvement-built', city.tile, new Irrigation());
  engine.emit('tile:improvement-built', city.tile, new Road());
});

engine.on('city:destroyed', (city, player) => {
  city.destroyed = {
    turn: Time.turn,
    by: player,
  };

  CityRegistry.unregister(city);
});

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

engine.on('city:shrink', (city) => {
  city.size--;
  city.foodStorage = 0;
});
