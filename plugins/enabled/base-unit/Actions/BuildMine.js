import {DelayedAction} from './DelayedAction.js';
import {Mine} from '../../base-tile-improvements/TileImprovements.js';
import TileImprovementRegistry from '../../core-tile-improvements/TileImprovementRegistry.js';

export class BuildMine extends DelayedAction {
  perform() {
    this.delayedAction({
      status: 'mining',
      action: () => TileImprovementRegistry.getInstance()
        .register(new Mine(this.unit.tile)),
      // TODO: calculate moves needed
      turns: 3,
    });

    this.rulesRegistry.process('unit:moved', this.unit, this);
  }
}

export default BuildMine;
