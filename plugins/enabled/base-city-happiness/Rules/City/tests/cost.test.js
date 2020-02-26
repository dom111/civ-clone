import '../../../register.js';
import '../cost.js';
import {Happiness, Unhappiness} from '../../../Yields.js';
import {Luxuries} from '../../../../base-luxuries/Yields.js';
import PlayerGovernment from '../../../../base-player-government/PlayerGovernment.js';
import PlayerGovernmentRegistry from '../../../../base-player-government/PlayerGovernmentRegistry.js';
import Unit from '../../../../core-unit/Unit.js';
import UnitRegistry from '../../../../core-unit/UnitRegistry.js';
import assert from 'assert';
import setUpCity from '../../../../base-city/tests/lib/setUpCity.js';

describe('city:cost', () => {
  it('should not provide `Happiness` for 1 `Luxuries` yield', () => {
    const city = setUpCity(2),
      {tile} = city
    ;

    tile.yields = () => [
      new Luxuries(1),
      new Happiness(0),
    ];

    const [happiness] = city.yields()
      .filter((cityYield) => cityYield instanceof Happiness)
    ;

    assert.strictEqual(happiness.value(), 0);
  });

  it('should provide 1 `Happiness` for 2 `Luxuries` yields', () => {
    const city = setUpCity(2),
      {tile} = city
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

  it('should provide 1 `Happiness` for 3 `Luxuries` yields', () => {
    const city = setUpCity(2),
      {tile} = city
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

  it('should exist in a city with a size of 6 or more with no garrisoned units', () => {
    const city = setUpCity(6),
      [unhappiness] = city.yields()
        .filter((cityYield) => cityYield instanceof Unhappiness)
    ;

    assert.strictEqual(unhappiness.value(), 1);
  });

  it('should be eradicated by martial law', () => {
    const city = setUpCity(6),
      {player, tile} = city,
      playerGovernment = new PlayerGovernment(player)
    ;

    PlayerGovernmentRegistry.register(playerGovernment);

    UnitRegistry.register(new Unit({
      player,
      city,
      tile,
    }));

    const [unhappiness] = city.yields()
      .filter((cityYield) => cityYield instanceof Unhappiness)
    ;

    assert.strictEqual(unhappiness.value(), 0);
  });

  it('should be eradicated by martial law up to 4 units', () => {
    const city = setUpCity(10),
      {player, tile} = city,
      playerGovernment = new PlayerGovernment(player)
    ;

    PlayerGovernmentRegistry.register(playerGovernment);

    for (let i = 0; i < 5; i++) {
      UnitRegistry.register(new Unit({
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
