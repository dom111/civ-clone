import '../action.js';
import {Attack, CaptureCity, Fortify, Move} from '../../../Actions.js';
import City from '../../../../core-city/City.js';
import CityRegistry from '../../../../core-city/CityRegistry.js';
import FillGenerator from '../../../../base-world-generator/FillGenerator.js';
import {Militia} from '../../../../base-unit/Units.js';
import Player from '../../../../core-player/Player.js';
import PlayerRegistry from '../../../../base-player/PlayerRegistry.js';
import UnitRegistry from '../../../../core-unit/UnitRegistry.js';
import World from '../../../../core-world/World.js';
import assert from 'assert';

describe('Unit:actions', () => {
  const world = new World(new FillGenerator({
      height: 10,
      width: 10,
    })),
    player1 = new Player(),
    player2 = new Player()
  ;

  world.build();

  [player1, player2]
    .forEach((player) => PlayerRegistry.register(player))
  ;

  const unit1 = new Militia({
      player: player1,
      tile: world.get(0, 0),
    }),
    unit2 = new Militia({
      player: player2,
      tile: world.get(1, 0),
    }),
    unit3 = new Militia({
      player: player1,
      tile: world.get(4, 4),
    }),
    city = new City({
      player: player2,
      tile: world.get(5, 5),
    })
  ;

  [unit1, unit2, unit3]
    .forEach((unit) => {
      UnitRegistry.register(unit);

      unit.movesLeft = 1;
    })
  ;

  CityRegistry.register(city);

  it('should be able to attack enemy unit next to it', () => {
    const actions = unit1.actions(unit2.tile);

    assert(actions.some((action) => action instanceof Attack));
  });

  it('should be able to fortify', () => {
    assert(unit1.actions()
      .some((action) => action instanceof Fortify)
    );
  });

  it('should not be able to move adjacent to an enemy unit', () => {
    [
      world.get(0, 1),
      world.get(0, 9),
      world.get(1, 0),
      world.get(1, 9),
    ]
      .forEach((destination) => {
        assert(unit1.actions(destination)
          .every((action) => ! (action instanceof Move))
        );
      })
    ;
  });

  it('should be able to move away from enemy unit', () => {
    [
      world.get(9, 9),
      world.get(9, 0),
      world.get(9, 1),
    ]
      .forEach((destination) => {
        assert(unit1.actions(destination)
          .some((action) => action instanceof Move)
        );
      })
    ;
  });

  it('should be possible to capture an unprotected enemy city', () => {
    assert(unit3.actions(city.tile)
      .some((action) => action instanceof CaptureCity)
    );
  });
});
