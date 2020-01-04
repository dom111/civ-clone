import Terrain from '../base-terrain/Terrain.js';
import Tile from './Tile.js';

export class World {
  constructor() {
    this.terrain = [];

    this.seed = Math.ceil(Math.random() * 1e7);
    // this.seed = 615489;

    Terrain.terrains.forEach((terrainDefinition) => {
      this.terrain.push(terrainDefinition);
    });

    this.map = this.generate()
      .map((row, y) => row.map((terrain, x) => new Tile({
        x,
        y,
        terrain,
        map: this,
      })))
    ;
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
    // const map = this;

    // TODO: use Engine#options
    options = options || {};

    const mapHeight = options.height || 100,
      mapWidth = options.width || 160,
      landCoverage = options.landCoverage || .66,
      chanceToBecomeLand = options.chanceToBecomeLand || .05, // chance to become land
      clusterChance = options.clusterChance || .66, // chance for adjacent tiles to cluster
      pathChance = options.pathChance || .66, // chance for directly adjacent tiles to be part of the path
      coverageScale = options.coverageScale || .66 // this scales the coverage, this could (and should) be factored in to the coverage for each tile
    ;

    //
    const getNeighbours = (index, height, width, directNeighbours = false) => {
      // TODO: this needs to handle wrapping
      const total = height * width;

      let n = index - width,
        ne = index - (width - 1),
        e = index + 1,
        se = index + (width + 1),
        s = index + width,
        sw = index + (width - 1),
        w = index - 1,
        nw = index - (width + 1)
      ;

      n += n < 0 ? total : 0;
      e -= e % total === 0 ? width : 0;
      s -= s > total ? total : 0;
      w += w % total === 0 ? width : 0;

      return (
        directNeighbours ?
          [n, e, s, w] :
          [n, ne, e, se, s, sw, w, nw]
      )
        .map((n) => n = n % (height * width))
        // .filter((x) => x < (width * height) && x > -1)
      ;
    };

    // Build land masses
    const generateLand = (height, width, map = Array(height * width).fill(0)) => {
      const seen = [],
        toProcess = [],
        seedTile = Math.floor(height * width * Math.random()),
        seedX = seedTile % width,
        seedY = Math.floor(seedTile / width)
      ;

      if (map[seedTile]) {
        return generateLand(height, width, map);
      }

      map[seedTile] = 1;

      seen.push(seedTile);

      toProcess.push(...getNeighbours(seedTile, height, width, true));

      while (toProcess.length) {
        const currentTile = toProcess.shift();

        if (! seen.includes(currentTile)) {
          const x = currentTile % width,
            y = Math.floor(currentTile / width),
            distance = Math.hypot(seedX - x, seedY - y)
          ;

          if (
            (Math.random() / distance) > chanceToBecomeLand ||
            getNeighbours(currentTile, height, width).reduce((total, n) => total + map[n], 0) > (distance / 3)
          ) {
            map[currentTile] = 1;

            toProcess.push(...getNeighbours(currentTile, height, width));
          }

          seen.push(currentTile);
        }
      }

      const [ocean, land] = [0, 1].map((land) => map.filter((flag) => flag === land).length);

      if (land / ocean < landCoverage) {
        return generateLand(height, width, map);
      }

      return map;
    };

    //
    // const populateTerrain = (m, h, w) => {
    const populateTerrain = (mapData, height, width) => {
      const landCells = mapData.map((value, index) => index).filter((index) => mapData[index] === 1),
        oceanCells = mapData.map((value, index) => index).filter((index) => mapData[index] === 0)
      ;

      oceanCells.forEach((index) => {
        mapData[index] = new (this.terrain[0])();
      });

      landCells.forEach((index) => {
        mapData[index] = new (this.terrain[1])();
      });

      this.terrain.forEach((terrain) => {
        if (terrain.distribution) {
          terrain.distribution.forEach((distributionData) => {
            const rangeCells = landCells.filter((n) => n >= ((distributionData.from * height) * width) && n <= ((distributionData.to * height) * width));

            // TODO: fudgeFactor
            let max = (rangeCells.length * distributionData.coverage) * coverageScale;

            while (max > 0) {
              const n = rangeCells[Math.floor(Math.random() * rangeCells.length)];

              mapData[n] = new terrain();
              max--;

              let neighbours = [];

              if (distributionData.clustered || distributionData.path) {
                neighbours = getNeighbours(n, height, width).filter((k) => rangeCells.includes(k));
              }

              if (distributionData.clustered) {
                neighbours.forEach((k) => {
                  // TODO: clusterChance
                  if (Math.random() < clusterChance) {
                    mapData[k] = new Terrain();
                    max--;
                  }
                });
              }
              else if (distributionData.path) {
                while (neighbours.length && Math.random() < pathChance) {
                  const cell = neighbours[Math.floor(Math.random() * neighbours.length)];

                  mapData[cell] = new terrain();
                  neighbours = getNeighbours(cell, height, width, true).filter((k) => rangeCells.includes(k));
                }
              }
            }
          });
        }
      });

      return mapData;
    };

    const mapData = populateTerrain(generateLand(mapHeight, mapWidth), mapHeight, mapWidth);

    const r = [];

    for (let i = 0; i < mapHeight; i++) {
      r.push(mapData.splice(0, mapWidth));
    }

    return r;
  }

  load() {
    // TODO
  }
}

export default World;