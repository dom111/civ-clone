import {Food, Production} from '../../../base-terrain-yields/Yields.js';
import UnitRegistry from '../../../core-unit/UnitRegistry.js';

engine.on('city:yield', (cityYield, city) => {
  if (cityYield instanceof Food) {
    city.foodStorage += cityYield.value();

    if (
      city.foodStorage >= ((city.size * 10) + 10)
      // RulesRegistry.get('city:grow')
      //   .some((rule) => rule.validate(city))
    ) {
      engine.emit('city:grow', city);
    }

    if (
      city.foodStorage < 0
      // RulesRegistry.get('city:shrink')
      //   .some((rule) => rule.validate(city))
    ) {
      engine.emit('city:shrink', city);
    }
  }

  if (cityYield instanceof Production) {
    if (city.building) {
      const production = cityYield.value();

      if (production > 0) {
        city.buildProgress += production;

        if (city.buildProgress >= city.buildCost) {
          engine.emit('city:building-complete', city, new (city.building)({
            player: city.player,
            city,
            tile: city.tile,
          }));

          city.building = false;
          city.buildProgress = 0;
        }
      }

      if (production < 0) {
        UnitRegistry.getBy('city', city)
          // TODO: this should probably be rule based
          .sort((a, b) => b.tile.distanceFrom(city.tile) - a.tile.distanceFrom(city.tile))
          .slice(production)
          .forEach((unit) => unit.destroy())
        ;
      }
    }
  }
});