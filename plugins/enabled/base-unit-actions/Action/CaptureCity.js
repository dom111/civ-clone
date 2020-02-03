import Move from './Move.js';

export class CaptureCity extends Move {
  perform() {
    if (super.perform()) {
      engine.emit('city:captured', this.to.city, this.unit.player);
    }
  }
}

export default CaptureCity;
