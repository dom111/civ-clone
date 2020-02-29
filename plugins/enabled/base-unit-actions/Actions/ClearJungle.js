import {DelayedAction} from './DelayedAction.js';
import {Grassland} from '../../base-terrain/Terrains.js';
import RulesRegistry from '../../core-rules/RulesRegistry.js';

export class ClearJungle extends DelayedAction {
  perform() {
    this.delayedAction({
      status: 'clearing',
      action: () => this.from.terrain = new Grassland(),
      // TODO: calculate moves needed
      turns: 3,
    });

    RulesRegistry.get('unit:moved')
      .filter((rule) => rule.validate(this.unit, this))
      .forEach((rule) => rule.process(this.unit, this))
    ;
  }
}

export default ClearJungle;
