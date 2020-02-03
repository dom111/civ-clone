import {Action} from '../../core-unit-actions/Action.js';

export class NoOrders extends Action {
  perform() {
    this.unit.movesLeft = 0;
  }
}

export default NoOrders;
