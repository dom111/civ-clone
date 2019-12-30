import Unit from 'core-unit/Unit.js';

export class Worker extends Unit {
  static name = 'worker';
  name = 'worker';
  title = 'Worker';
  cost = 20;
  attack = 0;
  defence = 1;
  movement = 1;
  visibility = 1;
  land = true;

  irrigate() {
    console.log('called irrigate');
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
          engine.emit('tile:improvement-built', this.tile, 'irrigation')
        },
        // TODO: calculate moves needed
        completeTurn: engine.turn + 3
      });
    }
    else {
      // TODO: alert, no access to water, etc
    }
  }

  buildRoad() {
    if (! this.tile.improvements.includes('road')) {
      this.delayedAction({
        status: 'road',
        action: () => {
          engine.emit('tile:improvement-built', this.tile, 'road')
        },
        completeTurn: engine.turn + 1
      });
    }
  }
}

export default Worker;