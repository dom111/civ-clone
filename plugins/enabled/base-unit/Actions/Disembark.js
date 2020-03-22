import Move from './Move.js';

export class Disembark extends Move {
  perform() {
    if (! super.perform()) {
      return;
    }

    this.unit()
      .moves()
      .set(0)
    ;

    this.unit()
      .transport
      .unload(this.unit())
    ;
  }
}

export default Disembark;
