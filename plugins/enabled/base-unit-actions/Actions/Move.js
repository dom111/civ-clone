import {Action} from '../../core-unit-actions/Action.js';
import RulesRegistry from '../../core-rules/RulesRegistry.js';

export class Move extends Action {
  perform() {
    const [movementCost] = RulesRegistry.get('unit:movementCost')
      .filter((rule) => rule.validate(this.unit, this.to, this.from))
      .map((rule) => rule.process(this.unit, this.to, this.from))
      .sort((a, b) => a - b)
    ;

    // TODO: this doesn't feel like it should be hard-coded...
    if ((movementCost > this.unit.moves.value()) && ((Math.random() * 1.5) < (this.unit.moves.value() / movementCost))) {
      this.unit.moves.subtract(this.unit.moves);

      return;
    }

    this.unit.moves.subtract(movementCost);
    this.unit.tile = this.to;

    // TODO: this probably shouldn't be hard-coded either
    if (this.unit.moves.value() < .1) {
      this.unit.moves.subtract(this.unit.moves);
    }

    RulesRegistry.get('unit:moved')
      .filter((rule) => rule.validate(this.unit, this))
      .forEach((rule) => rule.process(this.unit, this))
    ;

    return true;
  }
}

export default Move;
