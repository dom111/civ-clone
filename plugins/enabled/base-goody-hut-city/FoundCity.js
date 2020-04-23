import City from '../core-city/City.js';
import CityRegistry from '../core-city/CityRegistry.js';
import GoodyHutAction from '../core-goody-huts/GoodyHutAction.js';

export class BuildCity extends GoodyHutAction {
  /** @type {CityRegistry} */
  #cityRegistry;

  /**
   * @param goodyHut {GoodyHut}
   * @param cityRegistry {CityRegistry}
   * @param unit {Unit}
   */
  constructor({
    goodyHut,
    cityRegistry = CityRegistry.getInstance(),
    unit,
  } = {}) {
    super({
      goodyHut,
      unit,
    });

    this.#cityRegistry = cityRegistry;
  }

  perform() {
    const player = this.unit()
        .player(),
      city = new City({
        name: player.civilization.cityNames.shift(),
        player,
        tile: this.goodyHut()
          .tile()
        ,
      })
    ;

    this.#cityRegistry.register(city);
  }
}

export default BuildCity;
