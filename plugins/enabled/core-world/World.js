import Terrain from '../base-terrain/Terrain.js';
import Tile from './Tile.js';

export class World {
  constructor() {
    this.terrain = [];

    // TODO: use this to help generate consistent maps
    this.seed = Math.ceil(Math.random() * 1e7);
    // this.seed = 615489;

    Terrain.terrains.forEach((terrainDefinition) => {
      this.terrain.push(terrainDefinition);
    });

    // tiles that would be a 'great site for a city'
    const greatTileCoverage = .005;

    let regenerateCount = 0;

    while (! this.map) {
      this.map = this.generate()
        .map((row, y) => row.map((terrain, x) => new Tile({
          x,
          y,
          terrain,
          map: this,
        })))
      ;

      // TODO: _just_ (!) alter the map so that it does meet these criteria.
      if (
        (
          this.getBy((tile) => tile.surroundingArea.score() >= 150).length /
            (this.height * this.width)
        ) < greatTileCoverage
      ) {
        if (++regenerateCount > 30) {
          throw new TypeError('World generation failed repeatedly. Aborting.');
        }

        this.map = null;
      }
    }
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

    // this seems unnecessary with the above checks...
    // return (this.map[y] || [])[x] || false;
    return this.map[y][x];
  }

  // TODO: remove this when it's not needed for debugging
  toString() {
    const lookup = {
      Arctic: '\u001b[48;5;254m',
      Desert: '\u001b[48;5;229m',
      Forest: '\u001b[48;5;22m',
      Grassland: '\u001b[48;5;41m',
      Hills: '\u001b[48;5;101m',
      Jungle: '\u001b[48;5;72m',
      Mountains: '\u001b[48;5;243m',
      Ocean: '\u001b[48;5;18m',
      Plains: '\u001b[48;5;144m',
      River: '\u001b[48;5;27m',
      Swamp: '\u001b[48;5;130m',
      Tundra: '\u001b[48;5;223m',
      Terrain: '\u001b[0m',
    };

    return this.map.map((row) => row.map((tile) => `${lookup[tile.terrain.constructor.name]} \u001b[0m`).join('')).join('\n');
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
      const seen = {},
        toProcess = [],
        seedTile = Math.floor(height * width * Math.random()),
        seedX = seedTile % width,
        seedY = Math.floor(seedTile / width),
        flagAsSeen = (id) => {
          if (! (id in seen)) {
            seen[id] = 0;
          }

          seen[id]++;
        }
      ;

      // if (map[seedTile]) {
      //   return generateLand(height, width, map);
      // }

      map[seedTile] = 1;

      flagAsSeen(seedTile);

      toProcess.push(...getNeighbours(seedTile, height, width, true));

      while (toProcess.length) {
        const currentTile = toProcess.shift();

        if (! seen[currentTile] || seen[currentTile] < 3) {
          const x = currentTile % width,
            y = Math.floor(currentTile / width),
            distance = Math.hypot(seedX - x, seedY - y)
          ;

          if (
            (Math.random() / distance) > chanceToBecomeLand ||
            getNeighbours(currentTile, height, width)
              .reduce((total, n) => total + map[n], 0) > 5
          ) {
            map[currentTile] = 1;

            toProcess.push(...getNeighbours(currentTile, height, width, true));
          }

          flagAsSeen(currentTile);
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
        mapData[index] = Terrain.fromName('Ocean');
      });

      landCells.forEach((index) => {
        mapData[index] = Terrain.fromName('Grassland');
      });

      this.terrain.forEach((TerrainType) => {
        if (TerrainType.distribution) {
          TerrainType.distribution.forEach((distributionData) => {
            const rangeCells = landCells.filter((n) => n >= ((distributionData.from * height) * width) && n <= ((distributionData.to * height) * width));

            // TODO: fudgeFactor
            let max = (rangeCells.length * distributionData.coverage) * coverageScale;

            while (max > 0) {
              const n = rangeCells[Math.floor(Math.random() * rangeCells.length)];

              mapData[n] = new TerrainType();
              max--;

              let neighbours = [];

              if (distributionData.clustered || distributionData.path) {
                neighbours = getNeighbours(n, height, width).filter((k) => rangeCells.includes(k));
              }

              if (distributionData.clustered) {
                neighbours.forEach((k) => {
                  // TODO: clusterChance
                  if (Math.random() < clusterChance) {
                    mapData[k] = new TerrainType();
                    max--;
                  }
                });
              }
              else if (distributionData.path) {
                while (neighbours.length && Math.random() < pathChance) {
                  const cell = neighbours[Math.floor(Math.random() * neighbours.length)];

                  mapData[cell] = new TerrainType();
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

    const rows = [];

    for (let i = 0; i < mapHeight; i++) {
      rows.push(mapData.splice(0, mapWidth));
    }

    return rows;
  }

  load() {
    // TODO
  }
}

export default World;