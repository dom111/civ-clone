import AvailableTerrainFeatureRegistry from '../../../core-terrain-features/AvailableTerrainFeatureRegistry.js';
import Generator from '../../../core-world-generator/Generator.js';
import TerrainRegistry from '../../../core-terrain/TerrainRegistry.js';
import World from '../../../core-world/World.js';

export const Loader = class extends Generator {
  #schema;

  constructor(schema) {
    super({
      height: schema.height,
      width: schema.width,
    });

    this.#schema = schema;
  }

  generate() {
    const map = [];

    this.#schema.map.forEach(({name, features}) => {
      const [Terrain] = TerrainRegistry.getInstance()
          .getBy('name', name),
        terrain = new Terrain()
      ;

      terrain.features().push(features.map((feature) => {
        const [Feature] = AvailableTerrainFeatureRegistry.getInstance()
          .getBy('name', feature)
        ;

        return new Feature();
      }));

      map.push(terrain);
    });

    return map;
  }
};

export const simpleRLEDecoder = (mapString) => {
  const terrainLookup = {
      A: 'Arctic',
      D: 'Desert',
      F: 'Forest',
      G: 'Grassland',
      H: 'Hills',
      J: 'Jungle',
      M: 'Mountains',
      O: 'Ocean',
      P: 'Plains',
      R: 'River',
      S: 'Swamp',
      T: 'Tundra',
    },
    featureLookup = {
      c: 'Coal',
      f: 'Fish',
      a: 'Game',
      e: 'Gems',
      g: 'Gold',
      h: 'Horse',
      i: 'Oasis',
      o: 'Oil',
      s: 'Seal',
      d: 'Shield',
    }
  ;

  return mapString
    .replace(/^\s+|\s+$/g, '')
    .match(/(\d+|)([A-Z])([a-z]+|)/g)
    // .split(/\W+/)
    .flatMap((definition) => {
      const [, n, terrain, features] = definition.match(/(\d+|)([A-Z])([a-z]+|)?/);

      return new Array(parseInt(n) || 1)
        .fill({
          name: terrainLookup[terrain],
          features: (features || '')
            .split('')
            .map((char) => featureLookup[char]),
        })
      ;
    })
  ;
};

export const simpleWorldLoader = (schema) => {
  if (typeof schema === 'string') {
    const map = simpleRLEDecoder(schema);

    schema = {
      height: Math.sqrt(map.length),
      width: Math.sqrt(map.length),
      map,
    };
  }

  const world = new World(new Loader(schema));

  world.build();

  return world;
};

export default simpleWorldLoader;
