import {Fortified} from '../../../UnitImprovements.js';
import {Fortify} from '../../../../base-unit/Actions.js';
import Player from '../../../../core-player/Player.js';
import RulesRegistry from '../../../../core-rules/RulesRegistry.js';
import UnitImprovementRegistry from '../../../UnitImprovementRegistry.js';
import UnitRegistry from '../../../../core-unit/UnitRegistry.js';
import {Warrior} from '../../../../base-units-civ1/Units.js';
import action from '../../../../base-unit/Rules/Unit/action.js';
import activate from '../activate.js';
import assert from 'assert';
import created from '../../../../base-unit-yields/Rules/Unit/created.js';
import generateFixedWorld from '../../../../base-world/tests/lib/generateFixedWorld.js';
import warriorYield from '../../../../base-unit-warrior/Rules/Unit/yield.js';

describe('unit:activate', () => {
  const rulesRegistry = new RulesRegistry(),
    unitRegistry = new UnitRegistry(),
    unitImprovementRegistry = new UnitImprovementRegistry()
  ;

  rulesRegistry.register(
    ...action({
      rulesRegistry,
      unitRegistry,
    }),
    ...activate({
      unitImprovementRegistry,
    }),
    ...created(),
    ...warriorYield()
  );

  [
    [Fortify, Fortified],
  ]
    .forEach(([Action, UnitImprovement]) => {
      it(`should clear ${UnitImprovement.name} when triggered`, () => {
        const player = new Player(),
          world = generateFixedWorld(),
          unit = new Warrior({
            player,
            rulesRegistry,
            tile: world.get(1, 1),
          }),
          [action] = unit.actions()
            .filter((action) => action instanceof Action)
        ;

        assert(action instanceof Action);

        unitRegistry.register(unit);

        assert(! unitImprovementRegistry.getBy('unit', unit)
          .some((improvement) => improvement instanceof UnitImprovement)
        );

        unit.action({
          action,
        });

        unit.busy()
          .process({
            unitImprovementRegistry,
          })
        ;

        assert(unitImprovementRegistry.getBy('unit', unit)
          .some((improvement) => improvement instanceof UnitImprovement)
        );

        unit.activate();

        assert(! unitImprovementRegistry.getBy('unit', unit)
          .some((improvement) => improvement instanceof UnitImprovement)
        );
      });
    })
  ;
});
