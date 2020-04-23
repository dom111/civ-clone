import {Action} from '../../core-unit/Action.js';

export class NoOrders extends Action {
  perform() {
    this.unit()
      .moves()
      .subtract(this.unit().moves())
    ;
  }
}

export default NoOrders;
