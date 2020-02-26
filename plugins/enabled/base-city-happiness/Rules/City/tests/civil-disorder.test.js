import '../../../register.js';
import '../civil-disorder.js';
import '../cost.js';
import {Production} from '../../../../base-terrain-yields/Yields.js';
import RulesRegistry from '../../../../core-rules/RulesRegistry.js';
import assert from 'assert';
import setUpCity from '../../../../base-city/tests/lib/setUpCity.js';

describe('city:civil-disorder', () => {
  it('should be triggered in a city with more Unhappiness than Happiness', () => {
    const city = setUpCity(6);

    assert.strictEqual(
      RulesRegistry.get('city:civil-disorder')
        .some((rule) => rule.validate(city)),
      true
    );
  });

  it('should not be triggered in a city with no Unhappiness', () => {
    const city = setUpCity(5);

    assert.strictEqual(
      RulesRegistry.get('city:civil-disorder')
        .some((rule) => rule.validate(city)),
      false
    );
  });

  it('should halt production when in civil disorder', () => {
    const city = setUpCity(6),
      yields = city.yields(),
      [production] = yields.filter((cityYield) => cityYield instanceof Production)
    ;

    assert.strictEqual(production.value(), 0);
  });

  it('should not halt production when not in civil disorder', () => {
    const city = setUpCity(5),
      yields = city.yields(),
      [production] = yields.filter((cityYield) => cityYield instanceof Production)
    ;

    assert.strictEqual(production.value(), 6);
  });
});
