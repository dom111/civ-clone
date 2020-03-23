import {Action} from '../../core-unit/Action.js';

export class Move extends Action {
  perform() {
    const [valid] = this.rulesRegistry()
      .process('unit:validateMove', this.unit(), this.movementCost())
    ;

    if (! valid) {
      return false;
    }

    this.unit()
      .setTile(this.to())
    ;

    this.rulesRegistry().process('unit:moved', this.unit(), this);

    return true;
  }

  movementCost() {
    const [movementCost] = this.rulesRegistry().process('unit:movementCost', this.unit(), this.to(), this.from())
      .sort((a, b) => a - b)
    ;

    return movementCost;
  }
}

export default Move;
