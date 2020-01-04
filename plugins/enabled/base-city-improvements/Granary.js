import City from '../core-city/City.js';
import Improvement from '../core-city-improvement/Improvement.js';

export class Granary extends Improvement {
  name = 'granary';
  title = 'Granary';
  cost = 60;
  // all these need to be true for this to be available
  requires = [
    // (player) => !! player.advances.filter((advance) => advance.name === 'pottery').length
  ];
}

export default Granary;

// TODO: expose this via Improvement.register or something
Object.defineProperty(Improvement, 'Granary', {
  value: Granary,
});

// TODO: expose this via Improvement.register or something
Object.defineProperty(City.improvements, 'granary', {
  value: Granary,
});

engine.on('city:grow', (city) => {
  if (city.improvements.filter((improvement) => improvement instanceof Granary).length) {
    // TODO: this should just be Math.floor(city.foodStorageTotal * .5) or something, or there should be one source of
    //  truth for the total food storage (perhaps on City?)
    city.foodStorage = Math.floor(((city.size * 10) + 10) / 2);
  }
});
