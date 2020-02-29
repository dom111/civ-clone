import {DelayedAction} from './DelayedAction.js';
import {Mine} from '../../base-tile-improvements/TileImprovements.js';
import RulesRegistry from '../../core-rules/RulesRegistry.js';
import TileImprovementRegistry from '../../core-tile-improvements/TileImprovementRegistry.js';

export class BuildMine extends DelayedAction {
  perform() {
    this.delayedAction({
      status: 'mining',
      action: () => TileImprovementRegistry.register(new Mine(this.unit.tile)),
      // TODO: calculate moves needed
      turns: 3,
    });

    RulesRegistry.get('unit:moved')
      .filter((rule) => rule.validate(this.unit, this))
      .forEach((rule) => rule.process(this.unit, this))
    ;
  }
}

export default BuildMine;
