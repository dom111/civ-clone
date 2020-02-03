import Action from '../../core-unit-actions/Action.js';
import City from '../../core-city/City.js';

export class FoundCity extends Action {
  perform() {
    new City({
      player: this.unit.player,
      tile: this.unit.tile,
      // TODO: no.
      name: this.unit.player.civilization.cityNames.shift(),
    });

    this.unit.destroy();
  }
}

export default FoundCity;
