import {Happiness, Unhappiness} from '../../../Yields.js';
import RulesRegistry from '../../../../core-rules/RulesRegistry.js';
import assert from 'assert';
import civilDisorder from '../civil-disorder.js';
import setUpCity from '../../../../base-city/tests/lib/setUpCity.js';

describe('city:civil-disorder', () => {
  const rulesRegistry = new RulesRegistry();

  rulesRegistry.register(
    ...civilDisorder()
  );

  it('should be triggered in a city with Unhappiness and no Happiness', () => {
    const city = setUpCity({
        rulesRegistry,
      }),
      tile = city.tile()
    ;

    tile.yields = () => [
      new Unhappiness(1),
    ];

    assert(rulesRegistry.get('city:civil-disorder')
      .some((rule) => rule.validate(city))
    );
  });

  it('should be triggered in a city with more Unhappiness than Happiness', () => {
    const city = setUpCity({
        rulesRegistry,
      }),
      tile = city.tile()
    ;

    tile.yields = () => [
      new Unhappiness(2),
      new Happiness(1),
    ];

    assert(rulesRegistry.get('city:civil-disorder')
      .some((rule) => rule.validate(city))
    );
  });

  it('should be not triggered in a city with the same amount of Unhappiness and Happiness', () => {
    const city = setUpCity({
        rulesRegistry,
      }),
      tile = city.tile()
    ;

    tile.yields = () => [
      new Unhappiness(1),
      new Happiness(1),
    ];

    assert(! rulesRegistry.get('city:civil-disorder')
      .some((rule) => rule.validate(city))
    );
  });

  it('should not be triggered in a city with no Unhappiness', () => {
    const city = setUpCity({
      rulesRegistry,
    });

    assert(! rulesRegistry.get('city:civil-disorder')
      .some((rule) => rule.validate(city))
    );
  });

  // TODO: check effects of civil disorder
  // it('should halt production when in civil disorder', () => {
  //   const city = setUpCity({
  //       size: 6,
  //       rulesRegistry,
  //     }),
  //     yields = city.yields(),
  //     [production] = yields.filter((cityYield) => cityYield instanceof Production)
  //   ;
  //
  //   assert.strictEqual(production.value(), 0);
  // });
  //
  // it('should not halt production when not in civil disorder', () => {
  //   const city = setUpCity({
  //       size: 5,
  //     }),
  //     yields = city.yields(),
  //     [production] = yields.filter((cityYield) => cityYield instanceof Production)
  //   ;
  //
  //   assert.strictEqual(production.value(), 6);
  // });
});
