import {Action} from '../../core-unit-actions/Action.js';

export class NoOrders extends Action {
  perform() {
    this.unit.moves.subtract(this.unit.moves);
  }
}

export default NoOrders;
