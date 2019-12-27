// TODO: automate this acquisition
import Grassland from 'base-terrain/Grassland.js';
import Tile from './Tile.js';

export class World {
  constructor() {
    const map = this;

    map.terrain = [];

    // map.seed = Math.ceil(Math.random() * 1e7);
    map.seed = 615489;

    // TODO: fix this, register terrain types via classes... or something...
    // Engine.Plugin.get('terrain').forEach((terrain) => {e
    // [grassland].forEach((terrain) => {
    [new Grassland()].forEach((terrainDefinition) => {
      // terrain.contents.forEach((file) => {
      //   const terrainDefinition = engine.loadJSON(file);
      //
      //   if ('image' in terrainDefinition) {
      //     terrainDefinition.image = terrain.path + terrainDefinition.image;
      //   }

      // if ('adjacentImages' in terrainDefinition) {
      //   Object.keys(terrainDefinition.adjacentImages).forEach((key) => terrainDefinition.adjacentImages[key] = terrain.path + terrainDefinition.adjacentImages[key]);
      // }

      if ('special' in terrainDefinition) {
        terrainDefinition.special = terrainDefinition.special.map((special) => {
          // if ('overlay' in special) {
          //   special.overlay = terrain.path + special.overlay;
          // }

          return special;
        });
      }

      terrainDefinition.id = map.terrain.length;

      map.terrain.push(terrainDefinition);
      // });
    });

    map.map = map.generate().map((row, y) => row.map((terrainId, x) => new Tile({
      x: x,
      y: y,
      terrainId: terrainId,
      terrain: map.getTerrainType(terrainId),
      map: map
    })));
  }

  visibility(playerId, x, y) {
    return this.map[x][y].isVisible(playerId);
  }

  get width() {
    return this.map[0].length;
  }

  get height() {
    return this.map.length;
  }

  getBy(filterFunction) {
    return this.map.reduce((a, b) => a.concat(b), []).filter(filterFunction);
  }

  get(x, y) {
    // TODO: check map type
    if (x > (this.width - 1)) {
      x -= this.width;
    }
    else if (x < 0) {
      x += this.width;
    }

    if (y > (this.height - 1)) {
      y -= this.height;
    }
    else if (y < 0) {
      y += this.height;
    }

    return (this.map[y] || [])[x] || false;
  }

  getTerrainType(id) {
    return this.terrainTypes[id];
  }

  get terrainTypes() {
    return this.terrain;
  }

  generate(options) {
    const map = this;

    options = options || {};

    const mapHeight = options.height || 100;

    const mapWidth = options.width || 160;

    const seedDensity = options.seedDenisity || 3; // controls how many seed locations there are

    const iterations = options.iterations || 45; // iterations of applying neighbouring land

    const chanceToBecomeLand = options.chanceToBecomeLand || 0.02; // chance to become land

    const clusterChance = options.clusterChance || 0.66; // chance for adjacent tiles to cluster

    const pathChance = options.pathChance || 0.66; // chance for directly adjacent tiles to be part of the path

    const coverageScale = options.coverageScale || 0.66; // this scales the coverage, this could (and should) be factored in to the coverage for each tile

    //
    const _getNeighbours = (n, h, w, d) => {
      // TODO: this needs to handle wrapping
      return (d ? [n - w, n - 1, n + 1, n + w] : [n - (w + 1), n - w, n - (w - 1), n - 1, n + 1, n + (w - 1), n + w, n + (w + 1)]).filter((x) => x < (w * h) && x > -1);
    };

    // Build land masses
    const generateLand = (h, w) => {
      const m = Array(h * w).fill(0);

      let t = iterations;

      let s = Math.ceil(Math.sqrt(h * w) * seedDensity);
      while (s-- > 0) {
        m[Math.floor(Math.random() * (h * w))] = 1;
      }

      while (t-- > 0) {
        m.map((v, i) => v ? i : false).filter((v) => v).forEach((n) => {
          _getNeighbours(n, h, w).filter((n) => ! m[n]).forEach((n) => {
            if (Math.random() < chanceToBecomeLand) {
              m[n] = 1;
            }
          });
        });
      }

      return m;
    };

    //
    const populateTerrain = (m, h, w) => {
      const landCells = m.map((v, i) => i).filter((v) => m[v]);

      map.terrainTypes.forEach((terrain) => {
        // TODO: have custom water tiles and check if land/ocean
        if (terrain.distribution) {
          terrain.distribution.forEach((d) => {
            let rangeCells = landCells.filter((n) => n >= ((d.from * h) * w) && n <= ((d.to * h) * w));
            // alternatively, && m[n] != 0 to change existing changed land
            // TODO: fudgeFactor
            let max = (rangeCells.length * d.coverage) * coverageScale;
            rangeCells = rangeCells.filter((n) => m[n] === 1);

            max = Math.floor(Math.min(max, rangeCells.length));

            while (max > 0) {
              const n = rangeCells[Math.floor(Math.random() * rangeCells.length)];

              m[n] = terrain.id;
              max--;

              let neighbours = [];

              if (d.clustered || d.path) {
                neighbours = _getNeighbours(n, h, w).filter((k) => rangeCells.includes(k));
              }

              if (d.clustered) {
                neighbours.forEach((k) => {
                  // TODO: clusterChance
                  if (Math.random() < clusterChance) {
                    m[k] = terrain.id;
                    max--;
                  }
                });
              }
              else if (d.path) {
                while (neighbours.length && Math.random() < pathChance) {
                  const cell = neighbours[Math.floor(Math.random() * neighbours.length)];

                  m[cell] = terrain.id;
                  neighbours = _getNeighbours(cell, h, w, true).filter((k) => rangeCells.includes(k));
                }
              }
            }
          });
        }
      });

      return m;
    };

    const mapData = populateTerrain(generateLand(mapHeight, mapWidth), mapHeight, mapWidth);

    const r = [];

    let i = 0;

    for (; i < mapHeight; i++) {
      r.push(mapData.slice(i * mapHeight, (i + 1) * mapHeight));
    }

    return r;
  }

  load() {
    // TODO
  }
}

export default World;