import {Action} from '../../core-unit-actions/Action.js';
import {NavalTransport} from '../../base-unit/Types.js';
import UnitRegistry from '../../core-unit/UnitRegistry.js';

export class BoardTransport extends Action {
  perform() {
    const [targetVessel] = UnitRegistry.getBy('tile', this.to)
      .filter((tileUnit) => tileUnit instanceof NavalTransport)
      .filter((tileUnit) => tileUnit.hasCapacity())
    ;

    // TODO: throw?
    if (! targetVessel) {
      return false;
    }

    targetVessel.stow(this.unit);
  }
}

export default BoardTransport;
