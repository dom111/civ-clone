import {DelayedAction} from './DelayedAction.js';
import {Fortified} from '../../base-unit-improvements/UnitImprovements.js';
import UnitImprovementRegistry from '../../base-unit-improvements/UnitImprovementRegistry.js';

export class Fortify extends DelayedAction {
  perform() {
    this.delayedAction({
      status: 'fortify',
      action: ({
        unitImprovementRegistry = UnitImprovementRegistry.getInstance(),
      } = {}) => {
        this.unit.active = false;
        this.unit.busy = Infinity;

        unitImprovementRegistry.register(new Fortified(this.unit));
      },
      turns: 1,
    });

    this.rulesRegistry.process('unit:moved', this.unit, this);
  }
}

export default Fortify;
