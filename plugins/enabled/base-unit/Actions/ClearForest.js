import DelayedAction from './DelayedAction.js';
import {Plains} from '../../base-terrain/Terrains.js';

export class ClearForest extends DelayedAction {
  perform() {
    super.perform({
      name: 'clear-forest',
      action: () => {
        const terrain = new Plains();

        terrain.features().push(...this.from().features());

        this.from().setTerrain(terrain);
      },
      // TODO: calculate moves needed
      turns: 2,
    });

    this.rulesRegistry().process('unit:moved', this.unit(), this);
  }
}

export default ClearForest;
