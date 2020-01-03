import City from '../core-city/City.js';
import Improvement from '../core-city-improvement/Improvement.js';

export class Barracks extends Improvement {
  name = 'barracks';
  title = 'Barracks';
  cost = 40;
}

export default Barracks;

// TODO: expose this via Improvement.register or something
Object.defineProperty(Improvement, 'Barracks', {
  value: Barracks
});

// TODO: expose this via Improvement.register or something
Object.defineProperty(City.improvements, 'barracks', {
  value: Barracks
});

engine.on('unit:created', (unit) => {
  if (unit.city && unit.city.improvements.filter((improvement) => improvement instanceof Barracks).length) {
    // TODO: define and apply a unit upgrade rather than setting a flag
    unit.veteran = true;
  }
});
