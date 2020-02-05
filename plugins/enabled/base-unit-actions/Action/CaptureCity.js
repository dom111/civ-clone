import CityRegistry from '../../core-city/CityRegistry.js';
import Move from './Move.js';

export class CaptureCity extends Move {
  perform() {
    if (super.perform()) {
      engine.emit('city:captured', ...CityRegistry.getBy('tile', this.to), this.unit
        .player
      );
    }
  }
}

export default CaptureCity;
