import {Happiness} from '../../../Yields.js';
import {Luxuries} from '../../../../base-luxuries/Yields.js';
import RulesRegistry from '../../../../core-rules-registry/RulesRegistry.js';
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
});
