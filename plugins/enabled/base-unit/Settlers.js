import City from '../core-city/City.js';
import Worker from './Worker.js';

export class Settlers extends Worker {
  title = 'Settlers';

  buildCity({
    name = this.player.civilization.cityNames.shift(),
  } = {}) {
    engine.emit('unit:action', this, 'buildCity');
    new City({
      player: this.player,
      tile: this.tile,
      name,
    });

    this.destroy();
  }
}

export default Settlers;