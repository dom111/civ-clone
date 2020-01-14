import FortifiableUnit from './FortifiableUnit.js';

export class Militia extends FortifiableUnit {
  title = 'Militia';
  attack = 1;
  defence = 1;
  movement = 1;
  visibility = 1;
  land = true;
}

export default Militia;