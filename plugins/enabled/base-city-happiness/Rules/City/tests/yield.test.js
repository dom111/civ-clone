import '../../../registerYields.js';
import PlayerGovernment from '../../../../base-player-government/PlayerGovernment.js';
import PlayerGovernmentRegistry from '../../../../base-player-government/PlayerGovernmentRegistry.js';
import RulesRegistry from '../../../../core-rules/RulesRegistry.js';
import {Unhappiness} from '../../../Yields.js';
import Unit from '../../../../core-unit/Unit.js';
import UnitRegistry from '../../../../core-unit/UnitRegistry.js';
import assert from 'assert';
import cityYield from '../yield.js';
import governmentCost from '../../../../base-player-government/Rules/City/cost.js';
import setUpCity from '../../../../base-city/tests/lib/setUpCity.js';

describe('city:yield', () => {
  const rulesRegistry = new RulesRegistry();

  rulesRegistry.register(
    ...cityYield({
      rulesRegistry,
    }),
    ...governmentCost()
  );

  it('should produce Unhappiness in a city with a size of 6 or more ', () => {
    const city = setUpCity({
        size: 6,
        rulesRegistry,
      }),
      [unhappiness] = city.yields()
        .filter((cityYield) => cityYield instanceof Unhappiness)
    ;

    assert.strictEqual(unhappiness.value(), 1);
  });

  it('should eradicate Unhappiness by martial law', () => {
    const city = setUpCity({
        size: 6,
        rulesRegistry,
      }),
      player = city.player(),
      tile = city.tile(),
      playerGovernment = new PlayerGovernment({player})
    ;

    PlayerGovernmentRegistry.getInstance()
      .register(playerGovernment);

    const [unhappiness] = city.yields()
      .filter((cityYield) => cityYield instanceof Unhappiness)
    ;

    assert.strictEqual(unhappiness.value(), 1);

    UnitRegistry.getInstance()
      .register(new Unit({
        player,
        city,
        tile,
      }));

    const [updatedUnhappiness] = city.yields()
      .filter((cityYield) => cityYield instanceof Unhappiness)
    ;

    assert.strictEqual(updatedUnhappiness.value(), 0);
  });

  it('should eradicate Unhappiness by martial law for up to 4 units', () => {
    const city = setUpCity({
        size: 10,
        rulesRegistry,
      }),
      player = city.player(),
      tile = city.tile(),
      playerGovernment = new PlayerGovernment({player})
    ;

    PlayerGovernmentRegistry.getInstance()
      .register(playerGovernment);

    const [unhappiness] = city.yields()
      .filter((cityYield) => cityYield instanceof Unhappiness)
    ;

    assert.strictEqual(unhappiness.value(), 5);

    for (let i = 0; i < 5; i++) {
      UnitRegistry.getInstance()
        .register(new Unit({
          player,
          city,
          tile,
        }));
    }

    const [updatedUnhappiness] = city.yields()
      .filter((cityYield) => cityYield instanceof Unhappiness)
    ;

    assert.strictEqual(updatedUnhappiness.value(), 1);
  });
});
