import CityRegistry from '../../core-city/CityRegistry.js';
import Move from './Move.js';
import RulesRegistry from '../../core-rules-registry/RulesRegistry.js';

export class CaptureCity extends Move {
  #cityRegistry;

  /**
   * @param cityRegistry {CityRegistry}
   * @param from {Tile}
   * @param rulesRegistry {RulesRegistry}
   * @param to {Tile}
   * @param unit {Unit}
   */
  constructor({
    cityRegistry = CityRegistry.getInstance(),
    from,
    rulesRegistry = RulesRegistry.getInstance(),
    to,
    unit,
  }) {
    super({
      from,
      rulesRegistry,
      to,
      unit,
    });

    this.#cityRegistry = cityRegistry;
  }

  perform() {
    if (super.perform()) {
      this.#cityRegistry.getBy('tile', this.to())
        .forEach((city) => city.capture(this.unit().player()))
      ;
    }
  }
}

export default CaptureCity;
