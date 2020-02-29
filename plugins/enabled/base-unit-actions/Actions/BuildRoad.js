import {DelayedAction} from './DelayedAction.js';
import {Road} from '../../base-tile-improvements/TileImprovements.js';
import RulesRegistry from '../../core-rules/RulesRegistry.js';
import TileImprovementRegistry from '../../core-tile-improvements/TileImprovementRegistry.js';

export class BuildRoad extends DelayedAction {
  perform() {
    this.delayedAction({
      status: 'road',
      action: () => TileImprovementRegistry.register(new Road(this.unit.tile)),
      // TODO: calculate moves needed
      turns: 1,
    });

    RulesRegistry.get('unit:moved')
      .filter((rule) => rule.validate(this.unit, this))
      .forEach((rule) => rule.process(this.unit, this))
    ;
  }
}

export default BuildRoad;
