import DelayedAction from './DelayedAction.js';
import {Grassland} from '../../base-terrain/Terrains.js';

export class ClearJungle extends DelayedAction {
  perform() {
    super.perform({
      name: 'clear-jungle',
      action: () => this.from().setTerrain(new Grassland()),
      // TODO: calculate moves needed
      turns: 3,
    });

    this.rulesRegistry().process('unit:moved', this.unit(), this);
  }
}

export default ClearJungle;
