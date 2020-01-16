import Improvement from '../../core-city-improvement/Improvement.js';

export class CityWalls extends Improvement {
  name = 'city-walls';
  title = 'City Walls';
  static cost = 120;
}

export default CityWalls;

Improvement.register(CityWalls);