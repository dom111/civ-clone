import AvailableCityBuildItemsRegistry from './AvailableCityBuildItemsRegistry.js';
import {BuildProgress} from './Yields.js';
import {Production} from '../base-terrain-yields/Yields.js';
import RulesRegistry from '../core-rules-registry/RulesRegistry.js';

export class CityBuild {
  /** @type AvailableCityBuildItemsRegistry */
  #availableCityBuildItemsRegistry;
  /** @type {class} */
  #building;
  /** @type {City} */
  #city;
  /** @type {Production} */
  #cost = new Production(Infinity);
  /** @type {BuildProgress} */
  #progress = new BuildProgress()
  /** @type {RulesRegistry} */
  #rulesRegistry;

  /**
   * @param availableCityBuildItemsRegistry {AvailableCityBuildItemsRegistry}
   * @param city {City}
   * @param rulesRegistry {RulesRegistry}
   */
  constructor({
    availableCityBuildItemsRegistry = AvailableCityBuildItemsRegistry.getInstance(),
    city,
    rulesRegistry = RulesRegistry.getInstance(),
  }) {
    this.#availableCityBuildItemsRegistry = availableCityBuildItemsRegistry;
    this.#city = city;
    this.#rulesRegistry = rulesRegistry;
  }

  /**
   * @param production {Production}
   */
  add(production) {
    if (! (production instanceof Production)) {
      throw new TypeError(`CityBuild#add: Cannot add '${production.constructor ? production.constructor.name : typeof production}' to progress.`);
    }

    this.#progress.add(production);
  }

  /**
   * @returns {class[]}
   */
  available() {
    const buildImprovementRules = this.#rulesRegistry.get('city:build');

    // TODO: this still feels awkward... It's either this, or every rule has to be 'either it isn't this thing we're
    //  checking or it is and it meets the condition' or it's this. It'd be nice to be able to just filter the list in a
    //  more straightforward way...
    return this.#availableCityBuildItemsRegistry
      .filter((buildItem) => buildImprovementRules
        .filter((rule) => rule.validate(this.city(), buildItem))
        .every((rule) => rule.process(this.city(), buildItem)
          .validate()
        )
      )
    ;
  }

  /**
   * @param BuildItem {class}
   */
  build(BuildItem) {
    if (! this.available()
      .some((Entity) => Entity === BuildItem)
    ) {
      throw new TypeError(`Cannot build ${BuildItem.name}, it's not available.`);
    }

    this.#building = BuildItem;

    const [cost] = this.#rulesRegistry.process('city:build-cost', BuildItem, this.#city);

    this.#cost.set(cost);
  }

  /**
   * @returns {class}
   */
  building() {
    return this.#building;
  }

  check() {
    if (this.#progress.value() >= this.#cost.value()) {
      const built = new (this.#building)({
        player: this.#city.player(),
        city: this.#city,
        tile: this.#city.tile(),
      });

      this.#progress.set(0);
      this.#building = null;
      this.#cost.set(Infinity);

      this.#rulesRegistry.process('city:building-complete', this, built);

      return built;
    }
  }

  /**
   * @returns {City}
   */
  city() {
    return this.#city;
  }

  /**
   * @returns {Production}
   */
  cost() {
    return this.#cost;
  }

  /**
   * @returns {BuildProgress}
   */
  progress() {
    return this.#progress;
  }

  /**
   * @returns {number}
   */
  remaining() {
    return this.#cost.value() - this.#progress.value();
  }

  revalidate() {
    if (! this.available()
      .some((Entity) => Entity === this.#building)
    ) {
      this.#building = null;
      this.#cost.set(Infinity);

      this.#rulesRegistry.process('city:building-cancelled', this);
    }
  }
}

export default CityBuild;
