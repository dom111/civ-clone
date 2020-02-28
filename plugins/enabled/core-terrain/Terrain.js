// import TerrainRegistry from './TerrainRegistry.js';
// import TerrainFeature from '../core-terrain-features/TerrainFeature.js';

export class Terrain {
  movementCost = 1;
  features = [];

  constructor(...features) {
    this.features = features;
  }
  //
  // static load(data) {
  //   const [Entity] = TerrainRegistry.getBy('name', data.Type);
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
