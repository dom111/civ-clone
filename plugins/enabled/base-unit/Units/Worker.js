import {Irrigation, Mine, Railroad, Road} from '../../base-terrain/Improvements.js';
import LandUnit from '../Types/LandUnit.js';

export class Worker extends LandUnit {
  title = 'Worker';
  attack = 0;
  defence = 1;

  irrigate() {
    if (
      ! this.tile.improvements.some((improvement) => improvement instanceof Irrigation) &&
      Irrigation.availableOn(this.tile) &&
      // TODO: Tile#hasAccessToWater?
      (
        Object.keys(this.tile.adjacent)
          .map((direction) => this.tile.adjacent[direction])
          .filter((tile) =>
            tile.terrain.name === 'river' ||
            (tile.improvements.includes('irrigation') && ! tile.city)
            || tile.terrain.ocean
          )
          .length ||
        this.tile.terrain.name === 'river'
      )
    ) {
      this.delayedAction({
        status: 'irrigating',
        action: () => {
          engine.emit('tile:improvement-built', this.tile, new Irrigation());
        },
        // TODO: calculate moves needed
        turns: 3,
      });
    }
    else {
      // TODO: alert, no access to water, etc
    }
  }

  mine() {
    if (! this.tile.improvements.some((improvement) => improvement instanceof Mine)) {
      this.delayedAction({
        status: 'mine',
        action: () => {
          engine.emit('tile:improvement-built', this.tile, new Mine());
        },
        turns: 3,
      });
    }
  }

  road() {
    if (! this.tile.improvements.some((improvement) => improvement instanceof Road)) {
      this.delayedAction({
        status: 'road',
        action: () => {
          engine.emit('tile:improvement-built', this.tile, new Road());
        },
        turns: 1,
      });
    }
  }

  railroad() {
    if (! this.tile.improvements.some((improvement) => improvement instanceof Railroad)) {
      this.delayedAction({
        status: 'railroad',
        action: () => {
          engine.emit('tile:improvement-built', this.tile, new Railroad());
        },
        turns: 1,
      });
    }
  }
}

export default Worker;