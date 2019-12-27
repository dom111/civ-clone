import Unit from 'core-unit/Unit.js';

// TODO: subclass from Worker
export default class Settlers extends Unit {
  static name = 'settlers';
  title = 'Settlers';
  cost = 40;
  attack = 0;
  defence = 1;
  movement = 1;
  visibility = 1;
  land = true;

  buildCity() {
    new engine.City({
      player: this.player,
      tile: this.tile,
      name: this.player.cityNames.shift() // TODO: input box/confirmation
    });

    this.destroy();
  }

  irrigate() {
    if (! this.tile.improvements.includes('irrigation') && this.tile.terrain.improvements.irrigation && (Object.keys(this.tile.adjacent).map((direction) => this.tile.adjacent[direction]).filter((tile) => tile.terrain.name === 'river' || (tile.improvements.includes('irrigation') && ! tile.city) || tile.terrain.ocean).length || this.tile.terrain.name === 'river')) {
      // this.status = action.key;
      this.status = 'i';
      // TODO: terrain modifier
      // this.busy = action.turns;
      this.busy = 2;
      this.movesLeft = 0;
      this.currentAction = 'irrigate';
    }
    else {
      // TODO: alert, no access to water, etc
    }
  }
}

// TODO: change to Unit.register method
Unit.available.settlers = Settlers;
Unit.units.push(Settlers);

// TODO: register availableActions
Object.defineProperty(Unit, 'availableActions', {
  value: {
    // TODO: break this out into something else, so it can be used by a worker too?
    // Duplication seems pretty stupid, especially with the run/complete
    // buildCity: {
    //     name: 'buildCity',
    //     title: 'Build city',
    //     turns: 0,
    //     run: (unit, action) => {
    //         new City({
    //             player: unit.player,
    //             tile: unit.tile,
    //             name: unit.player.cityNames.shift() // TODO: input box/confirmation
    //         });

    //         unit.destroy();
    //     }
    // },
    irrigate: {
      name: 'irrigate',
      title: 'Build irrigation',
      turns: 2,
      key: 'i',
      availableTo: {
        include: ['settlers']
      },
      run: (unit, action) => {
        if (! unit.tile.improvements.includes('irrigation') && unit.tile.terrain.improvements.irrigation && (Object.keys(unit.tile.adjacent).map((direction) => unit.tile.adjacent[direction]).filter((tile) => tile.terrain.name === 'river' || (tile.improvements.includes('irrigation') && ! tile.city) || tile.terrain.ocean).length || unit.tile.terrain.name === 'river')) {
          unit.status = action.key;
          // TODO: terrain modifier
          unit.busy = action.turns;
          unit.movesLeft = 0;
          unit.currentAction = action;
        }
        else {
          // TODO: alert, no access to water, etc
        }
      },
      complete: (unit) => {
        unit.currentAction = unit.busy = false;
        engine.emit('tile-improvement-built', unit.tile, 'irrigation');
      }
    },
    road: {
      name: 'road',
      title: 'Build road',
      turns: 1,
      key: 'r',
      availableTo: {
        include: ['settlers']
      },
      run: (unit, action) => {
        if (! unit.tile.improvements.includes('road') && unit.tile.terrain.improvements.road) {
          unit.status = action.key;
          // TODO: terrain modifier
          unit.busy = action.turns;
          unit.movesLeft = 0;
          unit.currentAction = action;
        }
      },
      complete: (unit) => {
        unit.currentAction = unit.busy = false;
        engine.emit('tile-improvement-built', unit.tile, 'road');
      }
    },
    mine: {
      name: 'mine',
      title: 'Build mine',
      turns: 3,
      key: 'm',
      availableTo: {
        include: ['settlers']
      },
      run: (unit, action) => {
        if (! unit.tile.improvements.includes('mine') && unit.tile.terrain.improvements.mine) {
          unit.status = action.key;
          // TODO: terrain modifier
          unit.busy = action.turns;
          unit.movesLeft = 0;
          unit.currentAction = action;
        }
      },
      complete: (unit) => {
        unit.currentAction = unit.busy = false;
        engine.emit('tile-improvement-built', unit.tile, 'mine');
      }
    }
  }
});
