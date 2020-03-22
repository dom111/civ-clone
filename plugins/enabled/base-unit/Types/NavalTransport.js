import NavalUnit from './NavalUnit.js';
import {Sleep} from '../Actions/Sleep.js';
import Unit from '../../core-unit/Unit.js';

export class NavalTransport extends NavalUnit {
  #cargo = [];

  canStow(unit) {
    return unit instanceof Unit &&
      ! this.#cargo.includes(unit)
    ;
  }

  capacity() {
    return 0;
  }

  cargo() {
    return this.#cargo;
  }

  hasCapacity() {
    return this.#cargo.length < this.capacity();
  }

  hasCargo() {
    return this.#cargo.length > 0;
  }

  stow(unit) {
    if (! this.hasCapacity() || ! this.canStow(unit)) {
      return false;
    }

    unit.transport = this;
    unit.action(new Sleep({
      unit,
    }));

    this.#cargo.push(unit);

    return true;
  }

  unload(unit) {
    if (! this.#cargo.includes(unit)) {
      return false;
    }

    this.#cargo.splice(
      this.#cargo.indexOf(unit),
      1
    );

    return true;
  }
}

export default NavalTransport;
