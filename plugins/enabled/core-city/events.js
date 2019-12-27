// bind events - could be in a static method of City?
engine.on('turn-end', () => {
  engine.players.forEach((player) => {
    player.cities.forEach((city) => {
      city.foodStorage += city.surplusFood;

      if (city.foodStorage >= ((city.size * 10) + 10)) {
        city.size++;
        city.foodStorage = 0;

        engine.emit('city-grow', city);
      }

      if (city.building) {
        city.building.progress += city.production;

        if (city.building.progress >= city.building.cost) {
          if (city.building.unit) {
            // TODO: event?
            new engine.Unit({
              tile: city.tile,
              player: city.player,
              unit: city.building.unit,
              city: city
            });

            city.building = false;
          }
          else if (city.building.improvement) {
            // TODO: event?
            new (engine.City.Improvement.get(city.building.improvement))({
              city: city
            });

            city.building = false;
          }
          else {
            // TODO: stuff like 'wealth'
            // city.building.action();
          }
        }
      }
    });
  });
});

engine.on('city-captured', function(city, player) {
  const capturedCity = this;

  city.player.cities = this.player.cities.filter((city) => (city !== capturedCity));
  city.player = player;
  player.cities.push(this);
});

engine.on('city-destroyed', (city, player) => {
  city.destroyed = {
    turn: engine.turn,
    by: player
  };

  if (! city.player.cities.filter((city) => !! city.destroyed).some((value) => value === true)) {
    // TODO: all cities destroyed
  }

  // TODO: remove from map
});

engine.on('city-grow', (city) => {
  city.autoAssignWorkers();
  city.calculateRates();
});

engine.on('city-shrink', (city) => {
  city.autoAssignWorkers();
  city.calculateRates();
});

engine.on('player-rate-change', (player) => player.cities.forEach((city) => city.calculateRates()));
