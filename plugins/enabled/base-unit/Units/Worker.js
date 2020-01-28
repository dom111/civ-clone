import {Irrigation, Mine, Railroad, Road} from '../../base-terrain-improvements/Improvements.js';
import {LandUnit} from '../Types.js';
import {River} from '../../base-terrain/Terrain/River.js';

export class Worker extends LandUnit {
  title = 'Worker';
  attack = 0;
  defence = 1;

  irrigate() {
    if (
      Irrigation.availableOn(this.tile.terrain) &&
      // TODO: doing this a lot already, need to make improvements a value object with a helper method
      ! this.tile.improvements.some((improvement) => improvement instanceof Irrigation) &&
      [...this.tile.getAdjacent(), this.tile]
        .some((tile) => tile.terrain instanceof River ||
          tile.isCoast() ||
          (
            tile.improvements.some((improvement) => improvement instanceof Irrigation) &&
            ! tile.city
          )
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