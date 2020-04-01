import Barracks from '../../Barracks.js';
import CityImprovementRegistry from '../../../core-city-improvement/CityImprovementRegistry.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import UnitImprovementRegistry from '../../../base-unit-improvements/UnitImprovementRegistry.js';
import {Veteran} from '../../../base-unit-improvements/UnitImprovements.js';

export const getRules = ({
  cityImprovementRegistry = CityImprovementRegistry.getInstance(),
  unitImprovementRegistry = UnitImprovementRegistry.getInstance(),
} = {}) => [
  new Rule(
    'unit:created:veteran',
    new Criterion((unit) => unit.city() && cityImprovementRegistry.getBy('city', unit.city())
      .some((improvement) => improvement instanceof Barracks)
    ),
    new Effect((unit) => unitImprovementRegistry.register(new Veteran(unit)))
  ),
];

export default getRules;
