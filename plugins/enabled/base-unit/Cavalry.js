import Unit from '../core-unit/Unit.js';

export class Cavalry extends Unit {
  static cost = 20;
  title = 'Cavalry';
  attack = 2;
  defence = 1;
  movement = 2;
  visibility = 1;
  land = true;
}

export default Cavalry;

Unit.register(Cavalry);
