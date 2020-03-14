import {DelayedAction} from './DelayedAction.js';
import {Grassland} from '../../base-terrain/Terrains.js';

export class ClearJungle extends DelayedAction {
  perform() {
    this.delayedAction({
      status: 'clearing',
      action: () => this.from.terrain = new Grassland(),
      // TODO: calculate moves needed
      turns: 3,
    });

    this.rulesRegistry.process('unit:moved', this.unit, this);
  }
}

export default ClearJungle;
