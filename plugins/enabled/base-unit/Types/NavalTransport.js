import NavalUnit from './NavalUnit.js';
import Unit from '../../core-unit/Unit.js';

export class NavalTransport extends NavalUnit {
  capacity = 0;
  cargo = [];

  canStow(unit) {
    return unit instanceof Unit;
  }

  hasCapacity() {
    return this.cargo.length < this.capacity;
  }

  hasCargo() {
    return this.cargo.length > 0;
  }

  move(to) {
    const from = this.tile;

    super.move(to);

    this.cargo.forEach((unit) => {
      unit.tile = to;
      engine.emit('unit:moved', unit, from, to);
    });
  }

  stow(unit) {
    if (! this.hasCapacity() || ! this.canStow(unit)) {
      return false;
    }

    unit.sleep();

    this.cargo.push(unit);

    return true;
  }

  unload() {
    this.wait();

    this.cargo.forEach((unit) => {
      unit.active = true;
      unit.busy = false;
    });
  }
}

export default NavalTransport;
