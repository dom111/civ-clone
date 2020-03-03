import {Attack, Defence} from '../../../core-unit/Yields.js';
import {Fortified as FortifiedImprovement, Veteran as VeteranImprovement} from '../../UnitImprovements.js';
import {Fortified as FortifiedYieldModifier, Veteran as VeteranYieldModifier} from '../../YieldModifiers.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';
import UnitImprovementRegistry from '../../UnitImprovementRegistry.js';

[
  [FortifiedImprovement, FortifiedYieldModifier, Defence],
  [VeteranImprovement, VeteranYieldModifier, Attack, Defence],
]
  .forEach(([Improvement, YieldModifier, ...Yields]) => {
    RulesRegistry.register(new Rule(
      `unit:yield:${Improvement.name.toLowerCase()}`,
      new Criterion((unit, unitYield) => Yields.some((Yield) => unitYield instanceof Yield)),
      new Criterion((unit) => UnitImprovementRegistry.getBy('unit', unit)
        .some((improvement) => improvement instanceof Improvement)
      ),
      new Effect((unit, unitYield) => unitYield.addModifier(new YieldModifier(unit)))
    ));
  })
;
