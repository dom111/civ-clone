import Unit from '../core-unit/Unit.js';

export class Worker extends Unit {
  static cost = 20;
  title = 'Worker';
  attack = 0;
  defence = 1;
  land = true;

  irrigate() {
    if (
      ! this.tile.improvements.includes('irrigation') &&
      this.tile.terrain.improvements.irrigation &&
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
          engine.emit('tile:improvement-built', this.tile, 'irrigation');
        },
        // TODO: calculate moves needed
        turns: 3
      });
    }
    else {
      // TODO: alert, no access to water, etc
    }
  }

  mine() {
    if (! this.tile.improvements.includes('mine')) {
      this.delayedAction({
        status: 'mine',
        action: () => {
          engine.emit('tile:improvement-built', this.tile, 'mine');
        },
        turns: 3
      });
    }
  }

  road() {
    if (! this.tile.improvements.includes('road')) {
      this.delayedAction({
        status: 'road',
        action: () => {
          engine.emit('tile:improvement-built', this.tile, 'road');
        },
        turns: 1
      });
    }
  }
}

export default Worker;