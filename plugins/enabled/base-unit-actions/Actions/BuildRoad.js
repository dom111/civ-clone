import {DelayedAction} from './DelayedAction.js';
import {Road} from '../../base-tile-improvements/TileImprovements.js';
import TileImprovementRegistry from '../../core-tile-improvements/TileImprovementRegistry.js';

export class BuildRoad extends DelayedAction {
  perform() {
    this.delayedAction({
      status: 'road',
      action: () => TileImprovementRegistry.register(new Road(this.unit.tile)),
      // TODO: calculate moves needed
      turns: 1,
    });
  }
}

export default BuildRoad;
