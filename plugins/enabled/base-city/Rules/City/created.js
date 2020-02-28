import {Irrigation, Road} from '../../../base-tile-improvements/TileImprovements.js';
import CityBuild from '../../CityBuild.js';
import CityBuildRegistry from '../../CityBuildRegistry.js';
import CityRegistry from '../../../core-city/CityRegistry.js';
import Effect from '../../../core-rules/Effect.js';
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

RulesRegistry.register(new Rule(
  'city:created:register',
  new Effect((city) => CityRegistry.register(city))
));

RulesRegistry.register(new Rule(
  'city:created:build',
  new Effect((city) => CityBuildRegistry.register(new CityBuild(city)))
));

RulesRegistry.register(new Rule(
  'city:created:event',
  new Effect((city) => engine.emit('city:created', city))
));
