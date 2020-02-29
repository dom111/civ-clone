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

  stow(unit) {
    if (! this.hasCapacity() || ! this.canStow(unit)) {
      return false;
    }

    unit.transport = this;

    this.cargo.push(unit);

    return true;
  }

  unload() {
    this.wait();

    this.cargo.forEach((unit) => {
      this.cargo.splice(this.cargo.indexOf(unit), 1);

      unit.activate();
      unit.transport = null;
    });
  }
}

export default NavalTransport;
