import AvailableCityBuildItemsRegistry from './AvailableCityBuildItemsRegistry.js';
import {BuildProgress} from './Yields.js';
import {Production} from '../base-terrain-yields/Yields.js';
import RulesRegistry from '../core-rules/RulesRegistry.js';

export class CityBuild {
  #availableCityBuildItemsRegistry;
  #building;
  #city;
  #cost = new Production(Infinity);
  #progress = new BuildProgress();
  #rulesRegistry;

  constructor({
    availableCityBuildItemsRegistry = AvailableCityBuildItemsRegistry.getInstance(),
    city,
    rulesRegistry = RulesRegistry.getInstance(),
  }) {
    this.#availableCityBuildItemsRegistry = availableCityBuildItemsRegistry;
    this.#city = city;
    this.#rulesRegistry = rulesRegistry;
  }

  add(production) {
    if (! (production instanceof Production)) {
      throw new TypeError(`CityBuild#add: Cannot add '${production.constructor ? production.constructor.name : typeof production}' to progress.`);
    }

    this.#progress.add(production);
  }

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

  city() {
    return this.#city;
  }

  cost() {
    return this.#cost;
  }

  progress() {
    return this.#progress;
  }

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
