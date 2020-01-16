import {Fortified} from '../base-unit-improvements/Fortified.js';
import LandUnit from './LandUnit.js';

export class FortifiableUnit extends LandUnit {
  fortify() {
    this.delayedAction({
      status: 'fortify',
      action: () => {
        // TODO
        this.improvements.push(new Fortified());
      },
      turns: 1,
    });
  }
}

export default FortifiableUnit;