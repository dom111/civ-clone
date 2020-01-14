import FortifiableUnit from './FortifiableUnit.js';

export class Catapult extends FortifiableUnit {
  title = 'Catapult';
  attack = 6;
  defence = 1;
  movement = 1;
  visibility = 1;
  land = true;
}

export default Catapult;