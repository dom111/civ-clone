import {DelayedAction} from './DelayedAction.js';
import {Fortified} from '../../base-unit-improvements/Improvements.js';
import RulesRegistry from '../../core-rules/RulesRegistry.js';

export class Fortify extends DelayedAction {
  perform() {
    this.delayedAction({
      status: 'fortify',
      action: () => {
        this.unit.improvements.push(new Fortified());
        this.unit.active = false;
        this.unit.busy = Infinity;
      },
      turns: 1,
    });

    RulesRegistry.get('unit:moved')
      .filter((rule) => rule.validate(this.unit, this))
      .forEach((rule) => rule.process(this.unit, this))
    ;
  }
}

export default Fortify;
