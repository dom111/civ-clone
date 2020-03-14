import {Fortified as FortifiedImprovement, Veteran as VeteranImprovement} from '../../../UnitImprovements.js';
import {Fortified as FortifiedYieldModifier, Veteran as VeteranYieldModifier} from '../../../YieldModifiers.js';
import Player from '../../../../core-player/Player.js';
import RulesRegistry from '../../../../core-rules/RulesRegistry.js';
import {Spearman} from '../../../../base-unit/Units.js';
import UnitImprovementRegistry from '../../../UnitImprovementRegistry.js';
import assert from 'assert';
import setUpCity from '../../../../base-city/tests/lib/setUpCity.js';
import unitImprovementYield from '../yield.js';
import unitYield from '../../../../base-unit-yields/Rules/Unit/yield.js';

describe('unit:yield', () => {
  const rulesRegistry = new RulesRegistry();

  rulesRegistry.register(
    ...unitYield(),
    ...unitImprovementYield()
  );

  [
    [[], [], 2],
    [[FortifiedImprovement], [FortifiedYieldModifier], 4],
    [[VeteranImprovement], [VeteranYieldModifier], 3],
    [[FortifiedImprovement, VeteranImprovement], [VeteranYieldModifier, VeteranYieldModifier], 5],
  ]
    .forEach(([UnitImprovements, UnitYieldModifiers, expectedValue]) => {
      it(`should provide ${UnitYieldModifiers.map((Entity) => Entity.name).join(', ') || 'no'} modifiers to defence when ${UnitImprovements.map((Entity) => Entity.name).join(', ') || 'no'} improvements applied to the unit`, () => {
        const player = new Player({
            rulesRegistry,
          }),
          city = setUpCity({
            rulesRegistry,
          }),
          unit = new Spearman({
            city,
            player,
            tile: city.tile,
            rulesRegistry,
          })
        ;

        UnitYieldModifiers.forEach((UnitYieldModifier) => assert(! unit.defence
          .modifiers
          .has(UnitYieldModifier)
        ));

        UnitImprovements.forEach((UnitImprovement) => UnitImprovementRegistry.getInstance()
          .register(new UnitImprovement(unit)))
        ;

        UnitYieldModifiers.forEach((UnitYieldModifier) => assert(unit.defence
          .modifiers
          .has(UnitYieldModifier)
        ));

        assert.strictEqual(expectedValue, unit.defence.value());
      });
    })
  ;

  [
    [[], [], 1],
    [[FortifiedImprovement], [], 1],
    [[VeteranImprovement], [VeteranYieldModifier], 1.5],
    [[FortifiedImprovement, VeteranImprovement], [VeteranYieldModifier], 1.5],
  ]
    .forEach(([UnitImprovements, UnitYieldModifiers, expectedValue]) => {
      it(`should provide ${UnitYieldModifiers.map((Entity) => Entity.name).join(', ') || 'no'} modifiers to attack when ${UnitImprovements.map((Entity) => Entity.name).join(', ') || 'no'} improvements applied to the unit`, () => {
        const player = new Player({
            rulesRegistry,
          }),
          city = setUpCity({
            rulesRegistry,
          }),
          unit = new Spearman({
            city,
            player,
            tile: city.tile,
            rulesRegistry,
          })
        ;

        UnitYieldModifiers.forEach((UnitYieldModifier) => assert(! unit.attack
          .modifiers
          .has(UnitYieldModifier)
        ));

        UnitImprovements.forEach((UnitImprovement) => UnitImprovementRegistry.getInstance()
          .register(new UnitImprovement(unit)))
        ;

        UnitYieldModifiers.forEach((UnitYieldModifier) => assert(unit.attack
          .modifiers
          .has(UnitYieldModifier)
        ));

        assert.strictEqual(expectedValue, unit.attack.value());
      });
    })
  ;
});
