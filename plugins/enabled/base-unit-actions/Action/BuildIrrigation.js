import {DelayedAction} from './DelayedAction.js';
import {Irrigation} from '../../base-terrain-improvements/Improvements.js';

export class BuildIrrigation extends DelayedAction {
  perform() {
    this.delayedAction({
      status: 'irrigating',
      action: () => {
        engine.emit('tile:improvement-built', this.unit.tile, new Irrigation());
      },
      // TODO: calculate moves needed
      turns: 3,
    });
  }
}

export default BuildIrrigation;
