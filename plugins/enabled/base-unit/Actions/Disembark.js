import Move from './Move.js';

export class Disembark extends Move {
  perform() {
    if (! super.perform()) {
      return;
    }

    this.unit.moves.set(0);

    const {transport} = this.unit;

    transport.cargo.splice(
      transport.cargo.indexOf(this.unit),
      1
    );
  }
}

export default Disembark;
