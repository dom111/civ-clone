import {Action} from '../../core-unit-actions/Action.js';
import {NavalTransport} from '../../base-unit/Types.js';
import RulesRegistry from '../../core-rules/RulesRegistry.js';

export class Move extends Action {
  perform() {
    const [movementCost] = RulesRegistry.get('unit:movementCost')
      .filter((rule) => rule.validate(this.unit, this.to, this.from))
      .map((rule) => rule.process(this.unit, this.to, this.from))
      .sort((a, b) => a - b)
    ;

    // TODO: this doesn't feel like it should be hard-coded...
    if ((movementCost > this.unit.movesLeft) && ((Math.random() * 1.5) < (this.unit.movesLeft / movementCost))) {
      this.unit.movesLeft = 0;

      return;
    }

    this.unit.movesLeft -= movementCost;
    this.unit.tile = this.to;

    // TODO: this probably shouldn't be hard-coded either
    if (this.unit.movesLeft < .1) {
      this.unit.movesLeft = 0;
    }

    engine.emit('unit:moved', this.unit, this.from, this.to);

    // TODO: maybe do this with Rules?
    if (this.unit instanceof NavalTransport && this.unit.hasCargo()) {
      this.unit.cargo.forEach((unit) => {
        unit.action(this.forUnit(unit));
      });
    }

    return true;
  }
}

export default Move;
