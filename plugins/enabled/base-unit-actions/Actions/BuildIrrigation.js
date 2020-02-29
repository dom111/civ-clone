import {DelayedAction} from './DelayedAction.js';
import {Irrigation} from '../../base-tile-improvements/TileImprovements.js';
import RulesRegistry from '../../core-rules/RulesRegistry.js';
import TileImprovementRegistry from '../../core-tile-improvements/TileImprovementRegistry.js';

export class BuildIrrigation extends DelayedAction {
  perform() {
    this.delayedAction({
      status: 'irrigating',
      action: () => TileImprovementRegistry.register(new Irrigation(this.unit.tile)),
      // TODO: calculate moves needed
      turns: 3,
    });

    RulesRegistry.get('unit:moved')
      .filter((rule) => rule.validate(this.unit, this))
      .forEach((rule) => rule.process(this.unit, this))
    ;
  }
}

export default BuildIrrigation;
