import FortifiableUnit from './FortifiableUnit.js';

export class Cavalry extends FortifiableUnit {
  title = 'Cavalry';
  attack = 2;
  defence = 1;
  movement = 2;
  visibility = 1;
  land = true;
}

export default Cavalry;
