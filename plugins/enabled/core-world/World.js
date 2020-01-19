import {Land, Ocean} from '../base-terrain/Types.js';
import Registry from '../base-terrain/Registry.js';
import Tile from './Tile.js';
import Rules from '../core-rules/Rules.js';

export class World {
  constructor() {
    // TODO: use this to help generate consistent maps
    this.seed = Math.ceil(Math.random() * 1e7);
    // this.seed = 615489;

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

  generate(options) {
    // const map = this;

    // TODO: use Engine#options
    options = options || {};

    const mapHeight = options.height || 100,
      mapWidth = options.width || 160,
      landCoverage = options.landCoverage || .66,
      chanceToBecomeLand = options.chanceToBecomeLand || .05, // chance to become land
      defaultClusterChance = options.clusterChance || .33, // chance for adjacent tiles to cluster
      defaultPathChance = options.pathChance || .33 // chance for directly adjacent tiles to be part of the path
      // coverageScale = options.coverageScale || .66 // this scales the coverage, this could (and should) be factored in to the coverage for each tile
    ;

    //
    const getNeighbours = (index, height, width, directNeighbours = true) => {
      // TODO: this needs to handle wrapping
      const total = height * width,
        // TODO: validate these
        n = index - width,
        ne = index - (width - 1),
        e = index + 1,
        se = index + (width + 1),
        s = index + width,
        sw = index + (width - 1),
        w = index - 1,
        nw = index - (width + 1)
      ;

      return (
        directNeighbours ?
          [n, e, s, w] :
          [n, ne, e, se, s, sw, w, nw]
      )
        .map((index) => index > total ?
          index % total :
          index < 0 ?
            index + total :
            index
        )
      ;
    };

    // Build land masses
    const generateLand = (height, width, map = new Array(height * width)
      .fill(0)
      .map(() => new Ocean())
    ) => {
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

      map[seedTile] = new Land();

      flagAsSeen(seedTile);

      toProcess.push(...getNeighbours(seedTile, height, width));

      while (toProcess.length) {
        const currentTile = toProcess.shift();

        if (! seen[currentTile] || seen[currentTile] < 3) {
          const x = currentTile % width,
            y = Math.floor(currentTile / width),
            distance = Math.hypot(seedX - x, seedY - y)
          ;

          if (
            (Math.random() / distance) > chanceToBecomeLand ||
            getNeighbours(currentTile, height, width, false)
              .reduce((total, n) => total + (map[n] instanceof Land ? 1 : 0), 0) > 5
          ) {
            map[currentTile] = new Land();

            toProcess.push(...getNeighbours(currentTile, height, width));
          }

          flagAsSeen(currentTile);
        }
      }

      const [ocean, land] = [Ocean, Land].map((type) => map.filter((tile) => tile instanceof type).length);

      if ((land / ocean) < landCoverage) {
        return generateLand(height, width, map);
      }

      return map;
    };

    const populateTerrain = (mapData, height, width) => {
      const coords = (index) => [
        index % width,
        Math.floor(index / width),
      ];

      Rules.get('terrain:distributionGroups')
        .filter((rule) => rule.validate(Registry))
        .map((rule) => rule.process(Registry))
        .forEach((group) => group.forEach((TerrainType) => {
          Rules.get('terrain:distribution')
            .filter((rule) => rule.validate(TerrainType, mapData))
            .map((rule) => rule.process(TerrainType, mapData))
            .forEach((distribution) =>
              distribution.forEach((distributionData) => {
                const validIndices = Object.keys(mapData)
                  .filter((i) => mapData[i] instanceof TerrainType.__proto__)
                  .filter((i) =>
                    distributionData.fill ||
                    (
                      i >= ((distributionData.from * height) * width) &&
                      i <= ((distributionData.to * height) * width)
                    )
                  )
                ;

                if (distributionData.fill) {
                  validIndices.forEach((index) => mapData[index] = new TerrainType());

                  return;
                }

                // TODO: fudgeFactor
                let max = validIndices.length * distributionData.coverage;

                while (max > 0) {
                  const currentIndex = validIndices[Math.floor(Math.random() * validIndices.length)],
                    [currentX, currentY] = coords(currentIndex)
                  ;

                  mapData[currentIndex] = new TerrainType();
                  max--;

                  if (! distributionData.cluster && ! distributionData.path) {
                    continue;
                  }

                  if (distributionData.cluster) {
                    const clusterChance = distributionData.clusterChance || defaultClusterChance,
                      clusterNeighbours = getNeighbours(currentIndex, height, width)
                        .filter((index) => ! (mapData[index] instanceof TerrainType))
                    ;

                    while (clusterNeighbours.length) {
                      const index = clusterNeighbours.shift(),
                        [x, y] = coords(index)
                      ;

                      if ((Math.random() / Math.hypot(currentX - x, currentY - y)) >= clusterChance) {
                        mapData[index] = new TerrainType();
                        max--;

                        getNeighbours(index, height, width)
                          .forEach((index) => {
                            if (! (mapData[index] instanceof TerrainType) && (mapData[index] instanceof TerrainType.__proto__) && ! clusterNeighbours.includes(index)) {
                              clusterNeighbours.push(index);
                            }
                          })
                        ;
                      }
                    }
                  }

                  if (distributionData.path) {
                    const pathChance = distributionData.pathChance || defaultPathChance;

                    let index = currentIndex;

                    while (Math.random() > pathChance) {
                      const candidates = getNeighbours(index, height, width)
                        .filter((index) => (mapData[index] instanceof TerrainType.__proto__) &&
                          ! (mapData[index] instanceof TerrainType)
                        )
                      ;

                      index = candidates[Math.floor(Math.random() * candidates.length)];

                      mapData[index] = new TerrainType();
                      max--;
                    }
                  }
                }
              }
              ))
          ;
        }))
      ;

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