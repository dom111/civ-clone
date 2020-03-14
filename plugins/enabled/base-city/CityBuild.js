import AvailableCityImprovementRegistry from '../core-city-improvement/AvailableCityImprovementRegistry.js';
import AvailableUnitRegistry from '../core-unit/AvailableUnitRegistry.js';
import {BuildProgress} from './Yields.js';
import {Production} from '../base-terrain-yields/Yields.js';
import RulesRegistry from '../core-rules/RulesRegistry.js';

export class CityBuild {
  #availableCityImprovementRegistry;
  #availableUnitRegistry;
  #building;
  #city;
  #cost;
  #progress;
  #rulesRegistry;

  constructor({
    availableCityImprovementRegistry = AvailableCityImprovementRegistry.getInstance(),
    availableUnitRegistry = AvailableUnitRegistry.getInstance(),
    city,
    rulesRegistry = RulesRegistry.getInstance(),
  }) {
    this.#availableCityImprovementRegistry = availableCityImprovementRegistry;
    this.#availableUnitRegistry = availableUnitRegistry;
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
    return [
      ...this.availableBuildUnits(),
      ...this.availableBuildImprovements(),
    ];
  }

  availableBuildImprovements() {
    const buildImprovementRules = this.#rulesRegistry.get('city:build:improvement');

    // TODO: this still feels awkward... It's either this, or every rule has to be 'either it isn't this thing we're
    //  checking or it is and it meets the condition' or it's this. It'd be nice to be able to just filter the list in a
    //  more straightforward way...
    return this.#availableCityImprovementRegistry
      .filter((buildItem) => buildImprovementRules
        .filter((rule) => rule.validate(this.city, buildItem))
        .every((rule) => rule.process(this.city, buildItem)
          .validate()
        )
      )
    ;
  }

  availableBuildUnits() {
    const buildUnitRules = this.#rulesRegistry.get('city:build:unit');

    // TODO: this still feels awkward... It's either this, or every rule has to be 'either it isn't this thing we're
    //  checking or it is and it meets the condition'. It'd be nice to be able to just filter the list in a more
    //  straightforward way...
    return this.#availableUnitRegistry
      .filter((buildItem) => buildUnitRules
        .filter((rule) => rule.validate(this.city, buildItem))
        .every((rule) => rule.process(this.city, buildItem)
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
    [this.#cost] = this.#rulesRegistry.process('city:build-cost', BuildItem, this.#city);
    this.#progress = new BuildProgress();
  }

  building() {
    return this.#building;
  }

  check() {
    if (this.#progress.value() >= this.#cost) {
      const built = new (this.#building)({
        player: this.#city.player,
        city: this.#city,
        tile: this.#city.tile,
      });

      this.#rulesRegistry.process('city:building-complete', this.#city, built);

      this.#progress = null;
      this.#building = null;
      this.#cost = null;

      return built;
    }
  }

  get city() {
    return this.#city;
  }

  get cost() {
    return this.#cost;
  }

  get progress() {
    return this.#progress;
  }

  remaining() {
    return this.#cost - this.#progress.value();
  }
}

export default CityBuild;
