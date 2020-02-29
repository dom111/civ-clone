import {DelayedAction} from './DelayedAction.js';
import {Grassland} from '../../base-terrain/Terrains.js';
import RulesRegistry from '../../core-rules/RulesRegistry.js';
import {Shield} from '../../base-terrain-features/TerrainFeatures.js';

export class ClearSwamp extends DelayedAction {
  perform() {
    this.delayedAction({
      status: 'clearing',
      action: () => {
        const terrain = new Grassland();

        RulesRegistry.get('terrain:feature')
          .filter((rule) => rule.validate(Shield, terrain))
          .forEach((rule) => rule.process(Shield, terrain))
        ;

        // terrain.features.push(...this.from.features);

        this.from.terrain = terrain;
      },
      // TODO: calculate moves needed
      turns: 3,
    });

    RulesRegistry.get('unit:moved')
      .filter((rule) => rule.validate(this.unit, this))
      .forEach((rule) => rule.process(this.unit, this))
    ;
  }
}

export default ClearSwamp;
