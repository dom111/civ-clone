import {DelayedAction} from './DelayedAction.js';
import {Fortified} from '../../base-unit-improvements/Improvements.js';

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
  }
}

export default Fortify;
