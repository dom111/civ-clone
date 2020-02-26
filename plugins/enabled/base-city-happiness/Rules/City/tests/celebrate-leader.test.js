import '../../../register.js';
import '../celebrate-leader.js';
import '../cost.js';
import {Happiness, Unhappiness} from '../../../Yields.js';
import {Luxuries} from '../../../../base-luxuries/Yields.js';
import RulesRegistry from '../../../../core-rules/RulesRegistry.js';
import assert from 'assert';
import setUpCity from '../../../../base-city/tests/lib/setUpCity.js';

describe('city:celebrate-leader', () => {
  it('should trigger leader celebration when half or more citizens are happy and there is no unhappiness and the city size is greater than 2', () => {
    const city = setUpCity(4),
      {tile} = city
    ;

    tile.yields = () => [
      new Luxuries(4),
      new Happiness(0),
    ];

    assert.strictEqual(
      RulesRegistry.get('city:celebrate-leader')
        .some((rule) => rule.validate(city))
      ,
      true
    );
  });

  it('should not trigger leader celebration when half or more citizens are happy if any unhappiness', () => {
    const city = setUpCity(6),
      {tile} = city
    ;

    tile.yields = () => [
      new Luxuries(6),
      new Happiness(0),
      new Unhappiness(0),
    ];

    assert.strictEqual(
      RulesRegistry.get('city:celebrate-leader')
        .some((rule) => rule.validate(city))
      ,
      false
    );
  });

  it('should not trigger leader celebration when city size is < 3', () => {
    const city = setUpCity(2),
      {tile} = city
    ;

    tile.yields = () => [
      new Luxuries(6),
      new Happiness(0),
      new Unhappiness(0),
    ];

    assert.strictEqual(
      RulesRegistry.get('city:celebrate-leader')
        .some((rule) => rule.validate(city))
      ,
      false
    );
  });

  it('should not trigger leader celebration when happiness is less than half the city size', () => {
    const city = setUpCity(3),
      {tile} = city
    ;

    tile.yields = () => [
      new Luxuries(3),
      new Happiness(0),
      new Unhappiness(0),
    ];

    assert.strictEqual(
      RulesRegistry.get('city:celebrate-leader')
        .some((rule) => rule.validate(city))
      ,
      false
    );
  });
});
