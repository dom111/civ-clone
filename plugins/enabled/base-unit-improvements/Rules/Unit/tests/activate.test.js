import '../activate.js';
import {Fortified} from '../../../UnitImprovements.js';
import {Fortify} from '../../../../base-unit-actions/Actions.js';
import {Militia} from '../../../../base-unit/Units.js';
import Player from '../../../../core-player/Player.js';
import UnitImprovementRegistry from '../../../UnitImprovementRegistry.js';
import assert from 'assert';
import setUpCity from '../../../../base-city/tests/lib/setUpCity.js';

describe('unit:activate', () => {
  [
    Fortified,
  ]
    .forEach((UnitImprovement) => {
      it(`should clear ${UnitImprovement.name} when triggered`, () => {
        const player = new Player(),
          city = setUpCity(),
          unit = new Militia({
            city,
            player,
            tile: city.tile,
          }),
          [fortify] = unit.actions(city.tile)
            .filter((action) => action instanceof Fortify)
        ;

        assert(! UnitImprovementRegistry.getBy('unit', unit)
          .some((improvement) => improvement instanceof Fortified)
        );

        unit.action(fortify);

        assert.strictEqual(unit.status, 'fortify');

        unit.actionOnComplete();

        assert(UnitImprovementRegistry.getBy('unit', unit)
          .some((improvement) => improvement instanceof Fortified)
        );

        unit.activate();

        assert(! UnitImprovementRegistry.getBy('unit', unit)
          .some((improvement) => improvement instanceof Fortified)
        );
      });
    })
  ;
});
