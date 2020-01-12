import City from '../core-city/City.js';
import {Irrigation, Mine, Road} from '../base-terrain-improvements/Improvements.js';
import Player from './Player.js';
import {Settlers} from '../base-unit/Units.js';
import Tileset from '../core-world/Tileset.js';
import Unit from '../core-unit/Unit.js';

export class AIPlayer extends Player {
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

  // TODO: basic AI implementation, or at least methods to be called from another AI implementation
  chooseCivilization(choices) {
    const Random = choices[parseInt(choices.length * Math.random(), 10)];

    this.civilization = new Random();

    this.chooseLeader(this.civilization);
  }

  chooseLeader(civilization) {
    this.leader = civilization.leaders[Math.floor(civilization.leaders.length * Math.random())];
  }

  moveUnit(unit) {
    while (unit.active && unit.movesLeft > 0) {
      const currentTile = unit.tile,
        scoreMove = (tile) => {
          if (unit instanceof Settlers) {
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

          if (currentTile.city && tile.units.length && tile.units[0].player !== this && unit.attack > tile.units[0].defence) {
            return 12;
          }

          const discoverableTiles = Object.values(tile.neighbours)
            .some((tile) => ! tile.isVisible(this))
          ;

          if (discoverableTiles > 0) {
            return discoverableTiles * 3;
          }

          if (
            (tile.city && tile.city.player !== this) ||
            (tile.units.length && tile.units[0].player !== this)
          ) {
            if (! unit.attack) {
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
          const [item] = this.actions;

          if (item instanceof Unit) {
            const unit = item;

            if (unit instanceof Settlers) {
              if (
                ! Tileset.fromSurrounding(unit.tile, 4)
                  .cities()
                  .length &&
                unit.tile.surroundingArea.score() > 100
              ) {
                unit.buildCity();
              }
              else if (this.#shouldIrrigate(unit.tile)) {
                unit.irrigate();
              }
              else if (this.#shouldMine(unit.tile)) {
                unit.mine();
              }
              else if (this.#shouldRoad(unit.tile)) {
                unit.road();
              }
              else {
                this.moveUnit(item);
              }
            }
            else {
              // TODO: check for defense values and activate weaker for disband/upgrade/scouting
              if (item.tile.city && item.tile.city.player === this && item.tile.units.length === 1) {
                item.fortify();
              }
              else {
                this.moveUnit(item);
              }
            }
          }
          else if (item instanceof City) {
            const city = item;

            if (! city.units.filter((unit) => unit instanceof Settlers)) {
              city.build(Settlers);
            }
            else {
              const available = city.availableBuildItems,
                randomSelection = available[Math.floor(available.length * Math.random())]
              ;

              city.build(randomSelection);
            }
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

export default AIPlayer;
