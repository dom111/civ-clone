import DelayedAction from './DelayedAction.js';
import {Irrigation} from '../../base-tile-improvements/TileImprovements.js';
import TileImprovementRegistry from '../../core-tile-improvements/TileImprovementRegistry.js';

export class BuildIrrigation extends DelayedAction {
  perform() {
    super.perform({
      name: 'build-irrigation',
      action: () => TileImprovementRegistry.getInstance()
        .register(new Irrigation(this.unit().tile())),
      // TODO: calculate moves needed
      turns: 3,
    });

    this.rulesRegistry().process('unit:moved', this.unit(), this);
  }
}

export default BuildIrrigation;
