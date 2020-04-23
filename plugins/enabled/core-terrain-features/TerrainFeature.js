// import AvailableTerrainFeatureRegistry from './AvailableTerrainFeatureRegistry.js';

export class TerrainFeature {
  /**
   * @returns {TerrainFeature}
   */
  clone() {
    return new (this.constructor)();
  }

  // static load(data) {
  //   const Entity = AvailableTerrainFeatureRegistry.getInstance()
  //     .getBy('name', data.Type)
  //   ;
  //
  //   return new Entity();
  // }
  //
  // save() {
  //   return {
  //     Type: this.constructor.name,
  //   };
  // }
}

export default TerrainFeature;
