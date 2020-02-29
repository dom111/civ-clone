import {Move} from '../Actions/Move.js';
import {NavalTransport} from '../../base-unit/Types.js';
import RulesRegistry from '../../core-rules/RulesRegistry.js';
import UnitRegistry from '../../core-unit/UnitRegistry.js';

export class Embark extends Move {
  perform() {
    const [targetVessel] = UnitRegistry.getBy('tile', this.to)
      .filter((tileUnit) => tileUnit instanceof NavalTransport)
      .filter((tileUnit) => tileUnit.hasCapacity())
    ;

    // TODO: throw?
    if (! targetVessel) {
      return false;
    }

    super.perform();

    targetVessel.stow(this.unit);

    this.busy = Infinity;
    this.active = false;

    RulesRegistry.get('unit:moved')
      .filter((rule) => rule.validate(this.unit, this))
      .forEach((rule) => rule.process(this.unit, this))
    ;
  }
}

export default Embark;
