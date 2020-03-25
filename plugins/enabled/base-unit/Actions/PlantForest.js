import DelayedAction from './DelayedAction.js';
import {Forest} from '../../base-terrain/Terrains.js';

export class PlantForest extends DelayedAction {
  perform() {
    super.perform({
      name: 'plant-forest',
      action: () => this.from().setTerrain(new Forest(this.from().terrain().features())),
      // TODO: calculate moves needed
      turns: 3,
    });

    this.rulesRegistry().process('unit:moved', this.unit(), this);
  }
}

export default PlantForest;
