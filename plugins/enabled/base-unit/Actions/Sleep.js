import Criterion from '../../core-rules/Criterion.js';
import DelayedAction from './DelayedAction.js';
import Rule from '../../core-rules/Rule.js';

export class Sleep extends DelayedAction {
  perform() {
    this.unit()
      .setBusy(
        new Rule(
          'sleep',
          new Criterion(() => false)
        )
      )
    ;
  }
}

export default Sleep;
