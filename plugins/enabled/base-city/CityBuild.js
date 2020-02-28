import AvailableCityImprovementRegistry from '../core-city-improvement/AvailableCityImprovementRegistry.js';
import AvailableUnitRegistry from '../core-unit/AvailableUnitRegistry.js';
import {BuildProgress} from './Yields.js';
import {Production} from '../base-terrain-yields/Yields.js';
import RulesRegistry from '../core-rules/RulesRegistry.js';

export class CityBuild {
  #building;
  #city;
  #cost;
  #progress;

  constructor(city) {
    this.#city = city;
  }

  add(production) {
    if (! (production instanceof Production)) {
      throw new TypeError(`CityBuild#add: Cannot add '${production.constructor ?
        production.constructor.name :
        typeof production}' to buildProgress.`
      );
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
    const buildRulesRegistry = RulesRegistry.get('city:build:improvement');

    // TODO: this still feels awkward... It's either this, or every rule has to be 'either it isn't this thing we're
    //  checking or it is and it meets the condition' or it's this. It'd be nice to be able to just filter the list in a
    //  more straightforward way...
    return AvailableCityImprovementRegistry
      .filter((buildItem) => buildRulesRegistry.filter((rule) => rule.validate(this.city, buildItem))
        .every((rule) => rule.process(this.city, buildItem)
          .validate()
        )
      )
    ;
  }

  availableBuildUnits() {
    const buildRulesRegistry = RulesRegistry.get('city:build:unit');

    // TODO: this still feels awkward... It's either this, or every rule has to be 'either it isn't this thing we're
    //  checking or it is and it meets the condition'. It'd be nice to be able to just filter the list in a more
    //  straightforward way...
    return AvailableUnitRegistry
      .filter((buildItem) => buildRulesRegistry.filter((rule) => rule.validate(this.city, buildItem))
        .every((rule) => rule.process(this.city, buildItem)
          .validate()
        )
      )
    ;
  }

  build(BuildItem) {
    this.#building = BuildItem;
    [this.#cost] = RulesRegistry.get('city:build-cost')
      .filter((rule) => rule.validate(BuildItem, this.#city))
      .map((rule) => rule.process(BuildItem, this.#city))
    ;
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

      RulesRegistry.get('city:building-complete')
        .filter((rule) => rule.validate(this.#city, built))
        .forEach((rule) => rule.process(this.#city, built))
      ;

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
}

export default CityBuild;
