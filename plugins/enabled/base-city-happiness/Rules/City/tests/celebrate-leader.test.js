import {Happiness, Unhappiness} from '../../../Yields.js';
import RulesRegistry from '../../../../core-rules/RulesRegistry.js';
import assert from 'assert';
import celebrateLeader from '../celebrate-leader.js';
import setUpCity from '../../../../base-city/tests/lib/setUpCity.js';

describe('city:celebrate-leader', () => {
  const rulesRegistry = new RulesRegistry();

  rulesRegistry.register(
    ...celebrateLeader()
  );

  it('should trigger leader celebration when half or more citizens are happy and there is no unhappiness and the city size is greater than 2', () => {
    const city = setUpCity({
        size: 4,
        rulesRegistry,
      }),
      {tile} = city
    ;

    tile.yields = () => [
      new Happiness(2),
    ];

    assert(rulesRegistry.get('city:celebrate-leader')
      .some((rule) => rule.validate(city))
    );
  });

  it('should not trigger leader celebration when half or more citizens are happy if any unhappiness', () => {
    const city = setUpCity({
        size: 6,
        rulesRegistry,
      }),
      {tile} = city
    ;

    tile.yields = () => [
      new Happiness(5),
      new Unhappiness(1),
    ];

    assert(! rulesRegistry.get('city:celebrate-leader')
      .some((rule) => rule.validate(city))
    );
  });

  it('should not trigger leader celebration when city size is < 3', () => {
    const city = setUpCity({
        size: 2,
        rulesRegistry,
      }),
      {tile} = city
    ;

    tile.yields = () => [
      new Happiness(3),
      new Unhappiness(0),
    ];

    assert(! rulesRegistry.get('city:celebrate-leader')
      .some((rule) => rule.validate(city))
    );
  });

  it('should not trigger leader celebration when happiness is less than half the city size', () => {
    const city = setUpCity({
        size: 3,
        rulesRegistry,
      }),
      {tile} = city
    ;

    tile.yields = () => [
      new Happiness(1),
      new Unhappiness(0),
    ];

    assert(! rulesRegistry.get('city:celebrate-leader')
      .some((rule) => rule.validate(city))
    );
  });
});
