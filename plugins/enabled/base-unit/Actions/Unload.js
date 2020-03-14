import {Action} from '../../core-unit/Action.js';

export class Unload extends Action {
  perform() {
    this.unit.wait();
    this.unit.cargo
      .forEach((unit) => unit.activate())
    ;

    this.rulesRegistry.process('unit:moved', this.unit, this);
  }
}

export default Unload;
