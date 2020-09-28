import Naval from '../../base-unit/Types/Naval.js';
import RulesRegistry from '../../core-rules-registry/RulesRegistry.js';
import {Sleep} from '../../base-unit/Actions/Sleep.js';
import TransportManifest from '../TransportManifest.js';
import TransportRegistry from '../TransportRegistry.js';
import Unit from '../../core-unit/Unit.js';

export class NavalTransport extends Naval {
  /** @type {TransportRegistry} */
  #transportRegistry;

  /**
   * @param player {Player}
   * @param city {City}
   * @param rulesRegistry {RulesRegistry}
   * @param tile {Tile}
   * @param transportRegistry {TransportRegistry}
   */
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

  /**
   * @param unit {Unit}
   * @returns {boolean}
   */
  canStow(unit) {
    return unit instanceof Unit &&
      ! this.cargo()
        .includes(unit)
    ;
  }

  /**
   * @returns {number}
   */
  capacity() {
    return 0;
  }

  /**
   * @returns {Unit[]}
   */
  cargo() {
    return this.#transportRegistry.getBy('transport', this)
      .map((manifest) => manifest.unit())
    ;
  }

  /**
   * @returns {boolean}
   */
  hasCapacity() {
    return this.#transportRegistry.getBy('transport', this)
      .length < this.capacity()
    ;
  }

  /**
   * @returns {boolean}
   */
  hasCargo() {
    return this.#transportRegistry.getBy('transport', this)
      .length > 0
    ;
  }

  /**
   * @param unit {Unit}
   * @returns {boolean}
   */
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

  /**
   * @param unit {Unit}
   * @returns {boolean}
   */
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
