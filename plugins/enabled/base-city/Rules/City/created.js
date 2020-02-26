import Effect from '../../../core-rules/Effect.js';
import {Irrigation} from '../../../base-tile-improvements/TileImprovements.js';
import {Road} from '../../../base-tile-improvements/TileImprovements.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';
import TileImprovementRegistry from '../../../core-tile-improvements/TileImprovementRegistry.js';

RulesRegistry.register(new Rule(
  'city:created:tile:improvements',
  new Effect(({tile}) => {
    [
      new Irrigation(tile),
      new Road(tile),
    ]
      .forEach((improvement) => TileImprovementRegistry.register(improvement))
    ;
  })
));
