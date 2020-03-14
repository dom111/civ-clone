import {Irrigation, Road} from '../../../base-tile-improvements/TileImprovements.js';
import CityBuild from '../../CityBuild.js';
import CityBuildRegistry from '../../CityBuildRegistry.js';
import CityGrowth from '../../CityGrowth.js';
import CityGrowthRegistry from '../../CityGrowthRegistry.js';
import CityRegistry from '../../../core-city/CityRegistry.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import TileImprovementRegistry from '../../../core-tile-improvements/TileImprovementRegistry.js';

export const getRules = ({
  tileImprovementRegistry = TileImprovementRegistry.getInstance(),
  cityBuildRegistry = CityBuildRegistry.getInstance(),
  cityGrowthRegistry = CityGrowthRegistry.getInstance(),
  cityRegistry = CityRegistry.getInstance(),
  // engine = engine,
} = {}) => [
  new Rule(
    'city:created:tile:improvements',
    new Effect(({tile}) => {
      [
        new Irrigation(tile),
        new Road(tile),
      ]
        .forEach((improvement) => tileImprovementRegistry.register(improvement))
      ;
    })
  ),
  new Rule(
    'city:created:build',
    new Effect((city) => cityBuildRegistry.register(new CityBuild({city})))
  ),
  new Rule(
    'city:created:growth',
    new Effect((city) => cityGrowthRegistry.register(new CityGrowth(city)))
  ),
  new Rule(
    'city:created:register',
    new Effect((city) => cityRegistry.register(city))
  ),
  new Rule(
    'city:created:event',
    new Effect((city) => engine.emit('city:created', city))
  ),
];

export default getRules;
