import {Fortified} from '../base-unit-improvements/Fortified.js';
import Unit from '../core-unit/Unit.js';

export class FortifiableUnit extends Unit {
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