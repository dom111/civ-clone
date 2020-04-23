import RulesRegistry from '../core-rules-registry/RulesRegistry.js';
// import TerrainRegistry from './TerrainRegistry.js';
// import TerrainFeature from '../core-terrain-features/TerrainFeature.js';

export class Terrain {
  /** @type {TerrainFeature[]} */
  #features = [];
  /** @type {RulesRegistry} */
  #rulesRegistry;

  /**
   * @param rulesRegistry {RulesRegistry}
   */
  constructor(rulesRegistry = RulesRegistry.getInstance()) {
    this.#rulesRegistry = rulesRegistry;

    this.#rulesRegistry.process('terrain:created', this);
  }

  /**
   * @returns {Terrain}
   */
  clone() {
    const clone = new (this.constructor)(this.#rulesRegistry);

    clone.features()
      .push(
        ...this.#features
          .map((feature) => feature.clone())
      )
    ;

    return clone;
  }

  /**
   * @returns {TerrainFeature[]}
   */
  features() {
    return this.#features;
  }

  // static load(data) {
  //   const [Entity] = TerrainRegistry.getInstance()
  //     .getBy('name', data.Type)
  //   ;
  //
  //   return new Entity(data.features().map((feature) => TerrainFeature.load(feature)));
  // }
  //
  // save() {
  //   return {
  //     Type: this.constructor.name,
  //     features: this.features().map((feature) => feature.save()),
  //   };
  // }
}

export default Terrain;
