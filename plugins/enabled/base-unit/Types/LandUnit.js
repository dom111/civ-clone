import NavalTransport from './NavalTransport.js';
import Unit from '../../core-unit/Unit.js';
import {Water} from '../../core-terrain/Types.js';

export class LandUnit extends Unit {
  move(to) {
    if (
      to.terrain instanceof Water &&
      to.units.length &&
      to.units[0].player === this.player &&
      to.units.some((unit) => unit instanceof NavalTransport)
    ) {
      const [navalTransport] = to.units.filter((unit) => unit instanceof NavalTransport && unit.hasCapacity());

      if (navalTransport) {
        navalTransport.stow(this);

        return;
      }
    }

    return super.move(to);
  }
}

export default LandUnit;