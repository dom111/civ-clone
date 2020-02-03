import {DelayedAction} from './DelayedAction.js';
import {Road} from '../../base-terrain-improvements/Improvements.js';

export class BuildRoad extends DelayedAction {
  perform() {
    this.delayedAction({
      status: 'road',
      action: () => {
        engine.emit('tile:improvement-built', this.unit.tile, new Road());
      },
      // TODO: calculate moves needed
      turns: 1,
    });
  }
}

export default BuildRoad;
