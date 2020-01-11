import City from '../core-city/City.js';
import Player from './Player.js';
import {Settlers} from '../base-unit/Units.js';
import Tileset from '../base-world/Tileset.js';
import Unit from '../core-unit/Unit.js';

export class AIPlayer extends Player {
  #shouldIrrigate = (tile) => {
    return [
      'desert',
      'grassland',
      'plains',
      'river',
    ].includes(tile.terrain.name) &&
    ! tile.improvements.includes('irrigation') &&
    tile.surroundingArea.filter(
      (tile) => tile.city && tile.city.player === this
    ).length &&
    [...Object.values(tile.adjacent), tile].filter((tile) => tile.terrain.name === 'river' ||
      tile.terrain.isCoast ||
      (tile.improvements.includes('irrigation') && ! tile.city)
    ).length;
  };

  #shouldMine = (tile) => {
    return [
      'hills',
      'mountains',
    ].includes(tile.terrain.name) &&
    ! tile.improvements.includes('mine') &&
    tile.surroundingArea.filter(
      (tile) => tile.city && tile.city.player === this
    ).length;
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
    while (unit.movesLeft > 0) {
      const currentTile = unit.tile,
        scoreMove = (tile) => {
          if (unit instanceof Settlers) {
            if (this.#shouldIrrigate(tile)) {
              return 8;
            }

            if (this.#shouldMine(tile)) {
              return 4;
            }

            if (! tile.improvements.includes('road')) {
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
            .filter((tile) => ! tile.isVisible(this))
            .length
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
          .map((direction) => currentTile.neighbours[direction])
          .filter((tile) => unit.canMoveTo(tile) && scoreMove(tile) > -1)
          .sort((a, b) => (
            scoreMove(b) - scoreMove(a)
            // if there's no difference, sort randomly
          ) || Math.floor(Math.random() * 3) - 1)
      ;

      if (target) {
        unit.move(target);
      }
      else {
        console.log('noOrders');
        console.log(unit);
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
              else if (
                // TODO: other improvements
                unit.tile.surroundingArea.filter(
                  (tile) => tile.city && tile.city.player === this
                ).length &&
                ! unit.tile.improvements.includes('road')
              ) {
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
