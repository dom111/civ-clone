import Unit from 'core-unit/Unit.js';
import Worker from './Worker.js';

export class Settlers extends Worker {
  title = 'Settlers';
  cost = 40;

  buildCity({
    name = this.player.cityNames.shift()
  }) {
    new engine.City({
      player: this.player,
      tile: this.tile,
      name
    });

    this.destroy();
  }
}

export default Settlers;

Unit.register(Settlers);
