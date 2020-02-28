import {Action} from '../../core-unit-actions/Action.js';

export class Unload extends Action {
  perform() {
    this.unit.wait();
    this.unit.cargo
      .forEach((unit) => unit.activate())
    ;
  }
}

export default Unload;
