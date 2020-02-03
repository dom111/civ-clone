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

  action(action) {
    super.action(action);

    // TODO: need to make unload an action and deal with this differently, perhaps have a `Transport` action?
    this.cargo.forEach((unit) => {
      unit.action(action);
    });
  }

  stow(unit) {
    if (! this.hasCapacity() || ! this.canStow(unit)) {
      return false;
    }

    unit.sleep();
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
