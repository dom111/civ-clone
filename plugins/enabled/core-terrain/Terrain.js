// import TerrainRegistry from './TerrainRegistry.js';
// import TerrainFeature from '../core-terrain-features/TerrainFeature.js';

import RulesRegistry from '../core-rules/RulesRegistry.js';

export class Terrain {
  movementCost = 1;
  features = [];

  constructor(...features) {
    if (features.length) {
      this.features = features;

      return;
    }

    RulesRegistry.get('terrain:created')
      .filter((rule) => rule.validate(this))
      .forEach((rule) => rule.process(this))
    ;
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
