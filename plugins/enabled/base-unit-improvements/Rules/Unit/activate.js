import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import {Fortified} from '../../UnitImprovements.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';
import UnitImprovementRegistry from '../../UnitImprovementRegistry.js';

RulesRegistry.register(new Rule(
  'unit:activate:clearActive',
  new Criterion((unit) => unit.moves.value() > 0),
  new Effect((unit) => unit.active = true)
));

RulesRegistry.register(new Rule(
  'unit:activate:clear',
  new Effect((unit) => {
    unit.actionOnComplete = null;
    unit.busy = false;
    unit.status = null;
  })
));

[
  Fortified,
]
  .forEach((Improvement) => RulesRegistry.register(new Rule(
    `unit:activate:${Improvement.name.toLowerCase()}`,
    new Criterion((unit) => UnitImprovementRegistry.getBy('unit', unit)
      .some((improvement) => improvement instanceof Improvement))
    ,
    new Effect((unit) => UnitImprovementRegistry.unregister(
      ...UnitImprovementRegistry.getBy('unit', unit)
        .filter((improvement) => improvement instanceof Improvement)
    ))
  )))
;
