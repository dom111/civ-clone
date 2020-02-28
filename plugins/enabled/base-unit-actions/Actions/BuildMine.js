import {DelayedAction} from './DelayedAction.js';
import {Mine} from '../../base-tile-improvements/TileImprovements.js';
import TileImprovementRegistry from '../../core-tile-improvements/TileImprovementRegistry.js';

export class BuildMine extends DelayedAction {
  perform() {
    this.delayedAction({
      status: 'mining',
      action: () => TileImprovementRegistry.register(new Mine(this.unit.tile)),
      // TODO: calculate moves needed
      turns: 3,
    });
  }
}

export default BuildMine;
