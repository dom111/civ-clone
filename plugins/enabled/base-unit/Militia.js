import Unit from '../core-unit/Unit.js';

export class Militia extends Unit {
  static cost = 10;
  title = 'Militia';
  attack = 1;
  defence = 1;
  movement = 1;
  visibility = 1;
  land = true;
}

export default Militia;

Unit.register(Militia);
