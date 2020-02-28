import CityRegistry from '../../core-city/CityRegistry.js';
import Move from './Move.js';

export class CaptureCity extends Move {
  perform() {
    if (super.perform()) {
      CityRegistry.getBy('tile', this.to)
        .forEach((city) => city.capture(this.unit.player))
      ;
    }
  }
}

export default CaptureCity;
