import DelayedAction from './DelayedAction.js';
import {Road} from '../../base-tile-improvements/TileImprovements.js';
import TileImprovementRegistry from '../../core-tile-improvements/TileImprovementRegistry.js';

export class BuildRoad extends DelayedAction {
  perform() {
    super.perform({
      name: 'build-road',
      action: () => TileImprovementRegistry.getInstance()
        .register(new Road(this.unit().tile())),
      // TODO: calculate moves needed
      turns: 1,
    });

    this.rulesRegistry().process('unit:moved', this.unit(), this);
  }
}

export default BuildRoad;
