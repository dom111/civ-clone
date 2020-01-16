import Improvement from '../../core-city-improvement/Improvement.js';

export class Granary extends Improvement {
  name = 'granary';
  title = 'Granary';
  static cost = 60;
}

export default Granary;

Improvement.register(Granary);