import DelayedAction from './DelayedAction.js';
import {Grassland} from '../../base-terrain/Terrains.js';
import {Shield} from '../../base-terrain-features/TerrainFeatures.js';

export class ClearSwamp extends DelayedAction {
  perform() {
    super.perform({
      name: 'clear-swamp',
      action: () => {
        const terrain = new Grassland();

        this.rulesRegistry().process('terrain:feature', Shield, terrain);

        // terrain.features().push(...this.from().features());

        this.from().terrain = terrain;
      },
      // TODO: calculate moves needed
      turns: 3,
    });

    this.rulesRegistry().process('unit:moved', this.unit(), this);
  }
}

export default ClearSwamp;
