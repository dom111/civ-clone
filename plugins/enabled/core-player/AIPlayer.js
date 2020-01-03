import City from '../core-city/City.js';
import Player from './Player.js';
import {Settlers} from '../base-unit/Units.js';
import Tileset from '../base-world/Tileset.js';
import Unit from '../core-unit/Unit.js';

export class AIPlayer extends Player {
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
    unit.noOrders();

    unit.move(['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'][Math.floor(8 * Math.random())]);

    // TODO: break this out
    // const currentStrategy = item.data('strategy');
    //
    // if (currentStrategy)
    // const currentDirection = unit.data('currentDirection');
    //
    // if (currentDirection) {
    //
    // }
    // else {
    //   ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'][Math.floor(8 * Math.random())];
    //   // item.data('currentDirection', ...);
    // }
  }

  takeTurn() {
    return promiseFactory((resolve, reject) => {
      try {
        while (this.actions.length) {
          const item = this.actions.shift();

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
              else if (
                [
                  'desert',
                  'grassland',
                  'plains',
                  'river'
                ].includes(unit.tile.terrain.name) &&
                ! unit.tile.improvements.includes('irrigation') &&
                unit.tile.surroundingArea.filter(
                  (tile) => tile.city && tile.city.player === this
                ).length &&
                [...Object.values(unit.tile.adjacent), unit.tile].filter((tile) => tile.terrain.name === 'river' ||
                    tile.terrain.isCoast ||
                    (tile.improvements.includes('irrigation') && ! tile.city)
                ).length
              ) {
                unit.irrigate();
              }
              else if (
                [
                  'hills',
                  'mountains'
                ].includes(unit.tile.terrain.name) &&
                ! unit.tile.improvements.includes('mine') &&
                unit.tile.surroundingArea.filter(
                  (tile) => tile.city && tile.city.player === this
                ).length
              ) {
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
            const available = item.availableBuildItems,
              randomSelection = available[Math.floor(available.length * Math.random())]
            ;

            item.build(randomSelection);
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
