import {DelayedAction} from './DelayedAction.js';
import {Fortified} from '../../base-unit-improvements/UnitImprovements.js';
import RulesRegistry from '../../core-rules/RulesRegistry.js';
import UnitImprovementRegistry from '../../base-unit-improvements/UnitImprovementRegistry.js';

export class Fortify extends DelayedAction {
  perform() {
    this.delayedAction({
      status: 'fortify',
      action: () => {
        this.unit.active = false;
        this.unit.busy = Infinity;

        UnitImprovementRegistry.register(new Fortified(this.unit));
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
