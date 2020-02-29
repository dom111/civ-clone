import {DelayedAction} from './DelayedAction.js';
import {Plains} from '../../base-terrain/Terrains.js';
import RulesRegistry from '../../core-rules/RulesRegistry.js';

export class ClearForest extends DelayedAction {
  perform() {
    this.delayedAction({
      status: 'clearing',
      action: () => {
        const terrain = new Plains();

        terrain.features.push(...this.from.features);

        this.from.terrain = terrain;
      },
      // TODO: calculate moves needed
      turns: 2,
    });

    RulesRegistry.get('unit:moved')
      .filter((rule) => rule.validate(this.unit, this))
      .forEach((rule) => rule.process(this.unit, this))
    ;
  }
}

export default ClearForest;
