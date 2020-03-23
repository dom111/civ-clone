import NavalUnit from '../../base-unit/Types/NavalUnit.js';
import RulesRegistry from '../../core-rules/RulesRegistry.js';
import {Sleep} from '../../base-unit/Actions/Sleep.js';
import TransportManifest from '../TransportManifest.js';
import TransportRegistry from '../TransportRegistry.js';
import Unit from '../../core-unit/Unit.js';

export class NavalTransport extends NavalUnit {
  #transportRegistry;

  constructor({
    player,
    city,
    rulesRegistry = RulesRegistry.getInstance(),
    tile,
    transportRegistry = TransportRegistry.getInstance(),
  }) {
    super({player, city, tile, rulesRegistry});

    this.#transportRegistry = transportRegistry;
  }

  canStow(unit) {
    return unit instanceof Unit &&
      ! this.cargo()
        .includes(unit)
    ;
  }

  capacity() {
    return 0;
  }

  cargo() {
    return this.#transportRegistry.getBy('transport', this)
      .map((manifest) => manifest.unit())
    ;
  }

  hasCapacity() {
    return this.#transportRegistry.getBy('transport', this)
      .length < this.capacity()
    ;
  }

  hasCargo() {
    return this.#transportRegistry.getBy('transport', this)
      .length > 0
    ;
  }

  stow({
    unit,
  }) {
    if (! this.hasCapacity() || ! this.canStow(unit)) {
      return false;
    }

    this.#transportRegistry.register(new TransportManifest({
      transport: this,
      unit,
    }));

    unit.action({
      action: new Sleep({
        unit,
      }),
    });

    return true;
  }

  unload(unit) {
    const [manifest] = this.#transportRegistry.getBy('unit', unit);

    if (! manifest) {
      return false;
    }

    this.#transportRegistry.unregister(manifest);

    return true;
  }
}

export default NavalTransport;
