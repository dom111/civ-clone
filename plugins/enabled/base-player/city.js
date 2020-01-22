import Rules from '../core-rules/Rules.js';

engine.on('city:building-complete', (city, item) => {
  Rules.get('city:building-complete')
    .forEach((rule) => {
      if (rule.validate(city, item)) {
        rule.process(city, item);
      }
    })
  ;
});

engine.on('city:captured', (capturedCity, player) => {
  capturedCity.size--;

  if (capturedCity.size > 0) {
    capturedCity.player.cities = capturedCity.player.cities.filter((city) => city !== capturedCity);
  }
  else {
    engine.emit('city:destroyed', capturedCity, player);
  }

  if (capturedCity.player.cities.length === 0) {
    capturedCity.player.units.forEach((unit) => unit.destroy());
    engine.emit('player:defeated', capturedCity.player, player);
  }

  if (! capturedCity.originalPlayer) {
    capturedCity.originalPlayer = capturedCity.player;
  }

  capturedCity.player = player;
  player.cities.push(capturedCity);
});

engine.on('city:created', (city) => {
  city.player.cities.push(city);
});

engine.on('city:shrink', (city) => {
  if (city.production + city.size < city.units.length) {
    // TODO: rule
    city.units.splice(0, city.units.length - (city.production + city.size)).forEach((unit) => unit.disband());
  }
});
