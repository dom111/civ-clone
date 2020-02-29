import {Action} from '../../core-unit-actions/Action.js';
import RulesRegistry from '../../core-rules/RulesRegistry.js';

export class Unload extends Action {
  perform() {
    this.unit.wait();
    this.unit.cargo
      .forEach((unit) => unit.activate())
    ;

    RulesRegistry.get('unit:moved')
      .filter((rule) => rule.validate(this.unit, this))
      .forEach((rule) => rule.process(this.unit, this))
    ;
  }
}

export default Unload;
