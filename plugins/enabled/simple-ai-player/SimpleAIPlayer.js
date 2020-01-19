import {Irrigation, Mine, Road} from '../base-terrain/Improvements.js';
import {Militia, Settlers, Worker} from '../base-unit/Units.js';
import AIPlayer from '../core-player/AIPlayer.js';
import City from '../core-city/City.js';
import FortifiableUnit from '../base-unit/Types/FortifiableUnit.js';
import Tileset from '../core-world/Tileset.js';
import Unit from '../core-unit/Unit.js';

export class SimpleAIPlayer extends AIPlayer {
  #shouldIrrigate = (tile) => {
    return Irrigation.availableOn(tile) &&
      // TODO: doing this a lot already, need to make improvements a value object with a helper method
      ! tile.improvements.some((improvement) => improvement instanceof Irrigation) &&
      tile.surroundingArea.some((tile) => tile.city && tile.city.player === this) &&
      [...Object.values(tile.adjacent), tile].some((tile) => tile.terrain.name === 'river' ||
        tile.terrain.isCoast ||
        (tile.improvements.includes('irrigation') && ! tile.city)
      );
  };

  #shouldMine = (tile) => {
    return Mine.availableOn(tile) &&
      ! tile.improvements.some((improvement) => improvement instanceof Mine) &&
      tile.surroundingArea.some(
        (tile) => tile.city && tile.city.player === this
      );
  };

  #shouldRoad = (tile) => {
    return Road.availableOn(tile) &&
      ! tile.improvements.some((improvement) => improvement instanceof Road) &&
      tile.surroundingArea.some(
        (tile) => tile.city && tile.city.player === this
      )
    ;
  };

  #shouldBuildCity = (tile) => {
    return tile.surroundingArea.score() >= 120 &&
      ! Tileset.fromSurrounding(tile, 4)
        .cities()
        .length
    ;
  };

  #citiesToLiberate = [];
  #playersToAttack = [];

  constructor() {
    super();

    engine.on('city:captured', (city, player) => {
      if (city.originalPlayer === this) {
        if (! this.#citiesToLiberate.includes(city)) {
          this.#citiesToLiberate.push(city);
        }

        if (! this.#playersToAttack.includes(player)) {
          this.#playersToAttack.push(player);
        }
      }

      if (this.#citiesToLiberate.includes(city) && player === this) {
        this.#citiesToLiberate.splice(this.#citiesToLiberate.indexOf(city), 1);
      }
    });

    engine.on('unit:destroyed', (unit, player) => {
      if (unit.player === this) {
        if (! this.#playersToAttack.includes(player)) {
          this.#playersToAttack.push(player);
        }
      }
    });

    engine.on('city:grow', (city) => {
      if (city.player === this) {
        city.autoAssignWorkers();
      }
    });

    engine.on('city:shrink', (city) => {
      if (city.player === this) {
        city.autoAssignWorkers();
      }
    });

    // whenever we build an improvement near our cities, auto-assign the workers to make sure we're using the best tiles
    engine.on('tile:improvement-built', (tile) => {
      const ourNearbyCities = tile.surroundingArea
        .cities()
        .filter((city) => city.player === this)
      ;

      if (
        ourNearbyCities.length &&
        tile.units.length &&
        tile.units[0].player === this
      ) {
        ourNearbyCities.forEach((city) => city.autoAssignWorkers());
      }
    });
  }

  moveUnit(unit) {
    while (unit.active && unit.movesLeft > 0) {
      const currentTile = unit.tile,
        scoreMove = (tile) => {
          // TODO: consider appending all the positives to the score instead of returning immediately
          if (unit instanceof Worker) {
            if (unit instanceof Settlers && this.#shouldBuildCity(tile)) {
              return 16;
            }

            if (this.#shouldIrrigate(tile)) {
              return 8;
            }

            if (this.#shouldMine(tile)) {
              return 4;
            }

            if (this.#shouldRoad(tile)) {
              return 2;
            }
          }

          if (tile.city && tile.city.player !== this && ! tile.units.length) {
            return 16;
          }

          const target = unit.data('target');

          if (target) {
            if (tile.distanceFrom(target) < currentTile.distanceFrom(target)) {
              return 14;
            }
          }

          if (currentTile.city && tile.units.length && tile.units[0].player !== this && unit.finalAttack() > tile.units[0].finalDefence()) {
            return 12;
          }

          // add some jeopardy
          if (currentTile.city && tile.units.length && tile.units[0].player !== this && unit.finalAttack() > (tile.units[0].finalDefence() - .5)) {
            return 8;
          }

          const discoverableTiles = Object.values(tile.neighbours)
            .filter((tile) => ! tile.isVisible(this))
            .length
          ;

          if (discoverableTiles > 0) {
            return discoverableTiles * 3;
          }

          if (
            unit.attack > 0 &&
            this.#citiesToLiberate.length > 0
          ) {
            const target = this.#citiesToLiberate[Math.floor(this.#citiesToLiberate.length * Math.random())].tile;

            unit.data('target', target);

            if (tile.distanceFrom(target) < currentTile.distanceFrom(target)) {
              return 16;
            }
          }

          const attackableCityTiles = this.seenTiles
            .cities()
            .filter((city) => this.#playersToAttack.includes(city.player))
            .map(({tile}) => tile)
          ;

          if (unit.attack > 0 && attackableCityTiles.length) {
            const target = attackableCityTiles[Math.floor(attackableCityTiles.length * Math.random())];

            unit.data('target', target);

            if (tile.distanceFrom(target) < currentTile.distanceFrom(target)) {
              return 2;
            }
          }

          if (
            (tile.city && tile.city.player !== this) ||
            (tile.units.length && tile.units[0].player !== this)
          ) {
            if (unit.attack <= 0) {
              return -1;
            }

            const enemies = tile.units,
              [defender] = enemies.sort((a, b) => b.defence - a.defence)
            ;

            return unit.attack - defender.defense;
          }

          return 0;
        },
        [target] = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw']
          .map((direction) => currentTile.get(direction))
          .filter((tile) => unit.validateMove(tile) && scoreMove(tile) > -1)
          .sort((a, b) => (
            scoreMove(b) - scoreMove(a)
            // if there's no difference, sort randomly
          ) || Math.floor(Math.random() * 3) - 1)
      ;

      if (target) {
        unit.move(target);
      }
      else {
        unit.noOrders();
      }
    }
  }

  takeTurn() {
    return promiseFactory((resolve, reject) => {
      try {
        while (this.actions.length) {
          const [item] = this.actions,
            {tile} = item
          ;

          if (item instanceof Unit) {
            const unit = item;

            if (unit instanceof Worker) {
              if (unit instanceof Settlers && this.#shouldBuildCity(tile)) {
                unit.buildCity();
              }
              else if (this.#shouldIrrigate(tile)) {
                unit.irrigate();
              }
              else if (this.#shouldMine(tile)) {
                unit.mine();
              }
              else if (this.#shouldRoad(tile)) {
                unit.road();
              }
              else {
                this.moveUnit(unit);
              }
            }
            else {
              // TODO: check for defense values and activate weaker for disband/upgrade/scouting
              if (
                tile.city &&
                tile.units.length <= Math.ceil(tile.city.size / 8) &&
                unit instanceof FortifiableUnit
              ) {
                unit.fortify();
              }
              else {
                this.moveUnit(unit);
              }
            }
          }
          else if (item instanceof City) {
            const city = item;

            if (! tile.units.length) {
              // TODO: a more thorough check on this
              city.build(Militia);
            }
            // Always Build Cities
            else if (! city.units.filter((unit) => unit instanceof Settlers)) {
              city.build(Settlers);
            }
            else {
              const available = city.availableBuildItems,
                randomSelection = available[Math.floor(available.length * Math.random())]
              ;

              city.build(randomSelection);
            }
          }
          else {
            console.log(item);

            break;
          }
        }

        resolve();
      }
      catch (e) {
        reject(e);
      }
    });
  }
}

export default SimpleAIPlayer;
