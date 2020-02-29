import {DelayedAction} from './DelayedAction.js';
import {Forest} from '../../base-terrain/Terrains.js';
import RulesRegistry from '../../core-rules/RulesRegistry.js';

export class PlantForest extends DelayedAction {
  perform() {
    this.delayedAction({
      status: 'clearing',
      action: () => this.from.terrain = new Forest(this.from.terrain.features),
      // TODO: calculate moves needed
      turns: 3,
    });

    RulesRegistry.get('unit:moved')
      .filter((rule) => rule.validate(this.unit, this))
      .forEach((rule) => rule.process(this.unit, this))
    ;
  }
}

export default PlantForest;
