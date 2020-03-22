import '../../../registerYields.js';
import {Happiness, Unhappiness} from '../../../Yields.js';
import {Luxuries} from '../../../../base-luxuries/Yields.js';
import PlayerGovernment from '../../../../base-player-government/PlayerGovernment.js';
import PlayerGovernmentRegistry from '../../../../base-player-government/PlayerGovernmentRegistry.js';
import RulesRegistry from '../../../../core-rules/RulesRegistry.js';
import Unit from '../../../../core-unit/Unit.js';
import UnitRegistry from '../../../../core-unit/UnitRegistry.js';
import assert from 'assert';
import cost from '../cost.js';
import governmentCost from '../../../../base-player-government/Rules/City/cost.js';
import setUpCity from '../../../../base-city/tests/lib/setUpCity.js';

describe('city:cost', () => {
  const rulesRegistry = new RulesRegistry();

  rulesRegistry.register(
    ...cost({
      rulesRegistry,
    }),
    ...governmentCost()
  );

  it('should not provide Happiness for 1 Luxuries yield', () => {
    const city = setUpCity({
        size: 2,
        rulesRegistry,
      }),
      tile = city.tile()
    ;

    tile.yields = () => [
      new Luxuries(1),
      new Happiness(0),
    ];

    const [happiness] = city.yields({
      yields: [Luxuries, Happiness],
    })
      .filter((cityYield) => cityYield instanceof Happiness)
    ;

    assert.strictEqual(happiness.value(), 0);
  });

  it('should provide 1 Happiness for 2 Luxuries yields', () => {
    const city = setUpCity({
        size: 2,
        rulesRegistry,
      }),
      tile = city.tile()
    ;

    tile.yields = () => [
      new Luxuries(2),
      new Happiness(0),
    ];

    const [happiness] = city.yields()
      .filter((cityYield) => cityYield instanceof Happiness)
    ;

    assert.strictEqual(happiness.value(), 1);
  });

  it('should provide 1 Happiness for 3 Luxuries yields', () => {
    const city = setUpCity({
        size: 2,
        rulesRegistry,
      }),
      tile = city.tile()
    ;

    tile.yields = () => [
      new Luxuries(3),
      new Happiness(0),
    ];

    const [happiness] = city.yields()
      .filter((cityYield) => cityYield instanceof Happiness)
    ;

    assert.strictEqual(happiness.value(), 1);
  });

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

    UnitRegistry.getInstance()
      .register(new Unit({
        player,
        city,
        tile,
      }));

    const [unhappiness] = city.yields()
      .filter((cityYield) => cityYield instanceof Unhappiness)
    ;

    assert.strictEqual(unhappiness.value(), 0);
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

    for (let i = 0; i < 5; i++) {
      UnitRegistry.getInstance()
        .register(new Unit({
          player,
          city,
          tile,
        }));
    }

    const [unhappiness] = city.yields()
      .filter((cityYield) => cityYield instanceof Unhappiness)
    ;

    assert.strictEqual(unhappiness.value(), 1);
  });
});
