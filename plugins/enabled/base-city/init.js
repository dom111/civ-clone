import City from '../core-city/City.js';
import Rules from '../core-rules/Rules.js';
import {Irrigation, Road} from '../base-terrain/Improvements.js';
import Time from '../core-turn-based-game/Time.js';

engine.on('city:built', (city) => {
  engine.emit('tile:improvement-built', city.tile, new Irrigation());
  engine.emit('tile:improvement-built', city.tile, new Road());
});

engine.on('city:destroyed', (city, player) => {
  city.destroyed = {
    turn: Time.turn,
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
  city.assignUnassignedWorkers();
});

engine.on('city:shrink', (city) => {
  city.size--;
  city.foodStorage = 0;
});

engine.on('unit:registered', (unit) => {
  City.registerBuildUnit(unit);
});

engine.on('city-improvement:registered', (improvement) => {
  City.registerBuildImprovement(improvement);
});