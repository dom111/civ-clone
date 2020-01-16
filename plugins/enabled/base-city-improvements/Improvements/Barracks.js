import Improvement from '../../core-city-improvement/Improvement.js';

export class Barracks extends Improvement {
  name = 'barracks';
  title = 'Barracks';
  static cost = 40;
}

export default Barracks;

Improvement.register(Barracks);