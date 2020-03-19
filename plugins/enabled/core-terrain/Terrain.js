import RulesRegistry from '../core-rules/RulesRegistry.js';
// import TerrainRegistry from './TerrainRegistry.js';
// import TerrainFeature from '../core-terrain-features/TerrainFeature.js';

export class Terrain {
  #features = [];
  #rulesRegistry;

  constructor(rulesRegistry = RulesRegistry.getInstance()) {
    this.#rulesRegistry = rulesRegistry;

    this.#rulesRegistry.process('terrain:created', this);
  }

  get features() {
    return this.#features;
  }

  // static load(data) {
  //   const [Entity] = TerrainRegistry.getInstance()
  //     .getBy('name', data.Type)
  //   ;
  //
  //   return new Entity(data.features.map((feature) => TerrainFeature.load(feature)));
  // }
  //
  // save() {
  //   return {
  //     Type: this.constructor.name,
  //     features: this.features.map((feature) => feature.save()),
  //   };
  // }
}

export default Terrain;
