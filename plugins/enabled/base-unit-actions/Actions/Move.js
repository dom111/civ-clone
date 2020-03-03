import {Action} from '../../core-unit-actions/Action.js';
import RulesRegistry from '../../core-rules/RulesRegistry.js';

export class Move extends Action {
  perform() {
    const [movementCost] = RulesRegistry.get('unit:movementCost')
        .filter((rule) => rule.validate(this.unit, this.to, this.from))
        .map((rule) => rule.process(this.unit, this.to, this.from))
        .sort((a, b) => a - b),
      [valid] = RulesRegistry.get('unit:validateMove')
        .filter((rule) => rule.validate(this.unit, movementCost))
        .map((rule) => rule.process(this.unit, movementCost))
    ;

    if (! valid) {
      return false;
    }

    this.unit.tile = this.to;

    RulesRegistry.get('unit:moved')
      .filter((rule) => rule.validate(this.unit, this))
      .forEach((rule) => rule.process(this.unit, this))
    ;

    return true;
  }
}

export default Move;
