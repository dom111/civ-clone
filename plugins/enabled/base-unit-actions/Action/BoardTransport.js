import {Action} from '../../core-unit-actions/Action.js';
import {NavalTransport} from '../../base-unit/Types.js';
import TileUnitRegistry from '../../base-tile-units/TileUnitRegistry.js';

export class BoardTransport extends Action {
  perform() {
    const [targetVessel] = TileUnitRegistry.getBy('tile', this.to)
      .filter((tileUnit) => tileUnit instanceof NavalTransport)
      .filter((tileUnit) => tileUnit.hasCapacity())
    ;

    targetVessel.stow(this.unit);
  }
}

export default BoardTransport;
