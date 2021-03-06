import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import {Fortified} from '../../UnitImprovements.js';
import Rule from '../../../core-rules/Rule.js';
import UnitImprovementRegistry from '../../UnitImprovementRegistry.js';

export const getRules = ({
  unitImprovementRegistry = UnitImprovementRegistry.getInstance(),
} = {}) => [
  new Rule(
    'unit:activate:clearActive',
    new Criterion((unit) => unit.moves()
      .value() > 0
    ),
    new Effect((unit) => unit.setActive())
  ),

  new Rule(
    'unit:activate:clearBusy',
    new Effect((unit) => unit.setBusy())
  ),

  ...[
    Fortified,
  ]
    .map((Improvement) => new Rule(
      `unit:activate:${Improvement.name.toLowerCase()}`,
      new Criterion((unit) => unitImprovementRegistry.getBy('unit', unit)
        .some((improvement) => improvement instanceof Improvement))
      ,
      new Effect((unit) => unitImprovementRegistry.unregister(
        ...unitImprovementRegistry.getBy('unit', unit)
          .filter((improvement) => improvement instanceof Improvement)
      ))
    ))
  ,
];

export default getRules;
