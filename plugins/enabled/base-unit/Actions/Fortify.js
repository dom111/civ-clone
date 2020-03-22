import Criterion from '../../core-rules/Criterion.js';
import DelayedAction from './DelayedAction.js';
import {Fortified} from '../../base-unit-improvements/UnitImprovements.js';
import Rule from '../../core-rules/Rule.js';
import UnitImprovementRegistry from '../../base-unit-improvements/UnitImprovementRegistry.js';

export class Fortify extends DelayedAction {
  perform() {
    super.perform({
      name: 'fortify',
      action: ({
        unitImprovementRegistry = UnitImprovementRegistry.getInstance(),
      } = {}) => {
        this.unit()
          .setActive(false)
        ;
        this.unit()
          .setBusy(
            new Rule(
              'fortified',
              new Criterion(false)
            )
          )
        ;

        unitImprovementRegistry.register(new Fortified(this.unit()));
      },
      turns: 1,
    });

    this.rulesRegistry().process('unit:moved', this.unit(), this);
  }
}

export default Fortify;
