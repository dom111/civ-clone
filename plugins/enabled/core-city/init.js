import City from './City.js';

engine.on('city:destroyed', (city, player) => {
  city.destroyed = {
    // turn: engine.turn, // TODO: import Time and use Time.turn
    by: player,
  };

  if (! city.player.cities.filter((city) => !! city.destroyed).some((value) => value === true)) {
    // TODO: all cities destroyed
  }

  // TODO: remove from map
});

engine.on('city:grow', (city) => {
  city.autoAssignWorkers();
  // city.calculateRates();
});

engine.on('city:shrink', (city) => {
  city.autoAssignWorkers();
  // city.calculateRates();
});

// engine.on('player:rate-change', (player) => player.cities.forEach((city) => city.calculateRates()));

engine.on('unit:registered', (unit) => {
  City.registerBuildItem(unit);
});

engine.on('city-improvement:registered', (improvement) => {
  City.registerBuildItem(improvement);
});