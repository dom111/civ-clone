import Criterion from '../../core-rules/Criterion.js';
import {Move} from '../../base-unit/Actions/Move.js';
import {NavalTransport} from '../Types.js';
import Rule from '../../core-rules/Rule.js';
import UnitRegistry from '../../core-unit/UnitRegistry.js';

export class Embark extends Move {
  /**
   * @param unitRegistry {UnitRegistry}
   * @returns {boolean}
   */
  perform({
    unitRegistry = UnitRegistry.getInstance(),
  } = {}) {
    const [targetVessel] = unitRegistry.getBy('tile', this.to())
      .filter((tileUnit) => tileUnit instanceof NavalTransport)
      .filter((tileUnit) => tileUnit.hasCapacity())
    ;

    // TODO: throw?
    if (! targetVessel) {
      return false;
    }

    super.perform();

    targetVessel.stow({
      unit: this.unit(),
    });

    this.unit()
      .setBusy(new Rule(
        new Criterion(() => false)
      ))
    ;
    this.unit()
      .setActive(false)
    ;

    this.rulesRegistry().process('unit:moved', this.unit(), this);
  }
}

export default Embark;
