import {DelayedAction} from './DelayedAction.js';
import {Mine} from '../../base-terrain-improvements/Improvements.js';

export class BuildMine extends DelayedAction {
  perform() {
    this.delayedAction({
      status: 'mining',
      action: () => {
        engine.emit('tile:improvement-built', this.unit.tile, new Mine());
      },
      // TODO: calculate moves needed
      turns: 3,
    });
  }
}

export default BuildMine;
