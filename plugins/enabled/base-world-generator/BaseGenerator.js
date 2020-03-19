import {Land, Water} from '../core-terrain/Types.js';
import {Generator} from '../core-world-generator/Generator.js';
import RulesRegistry from '../core-rules/RulesRegistry.js';

export class BaseGenerator extends Generator {
  #chanceToBecomeLand;
  #clusterChance;
  #coverage;
  #landCoverage;
  #landMassReductionScale;
  #map;
  #maxIterations;
  #pathChance;
  #rulesRegistry;

  constructor({
    coverage = .1,
    chanceToBecomeLand = 5,
    clusterChance = .05,
    height = 100,
    landCoverage = .66,
    landMassReductionScale = 3,
    maxIterations = 1,
    pathChance = .05,
    rulesRegistry = RulesRegistry.getInstance(),
    width = 160,
  } = {}) {
    super({height, width});

    this.#chanceToBecomeLand = chanceToBecomeLand; // chance to become land
    this.#clusterChance = clusterChance; // chance for adjacent tiles to cluster
    this.#coverage = coverage; // total coverage of terrain type
    this.#landCoverage = landCoverage; // total coverage required
    this.#landMassReductionScale = landMassReductionScale;
    this.#maxIterations = maxIterations; // number of times a tile can be tested to change to land
    this.#pathChance = pathChance; // chance for directly adjacent tiles to be part of the path
    this.#rulesRegistry = rulesRegistry;

    this.#map = new Array(this.height * this.width)
      .fill(0)
      .map(() => new Water())
    ;
  }

  generateLand() {
    const seen = {},
      toProcess = [],
      seedTile = Math.floor((this.height * this.width) * Math.random()),
      flagAsSeen = (id) => {
        if (! (id in seen)) {
          seen[id] = 0;
        }

        seen[id]++;
      }
    ;

    this.#map[seedTile] = new Land();

    flagAsSeen(seedTile);

    toProcess.push(...this.getNeighbours(seedTile));

    while (toProcess.length) {
      const currentTile = toProcess.shift();

      if (! seen[currentTile] || seen[currentTile] < this.#maxIterations) {
        const distance = this.distanceFrom(seedTile, currentTile);

        if (
          ((this.#chanceToBecomeLand / distance) >= Math.random()) ||
          this.getNeighbours(currentTile, false)
            .reduce((total, n) => total + (this.#map[n] instanceof Land ? 1 : 0), 0) > 5
        ) {
          this.#map[currentTile] = new Land();

          toProcess.push(...this.getNeighbours(currentTile));
        }

        flagAsSeen(currentTile);
      }
    }

    const land = this.#map
      .filter((tile) => tile instanceof Land)
      .length
    ;

    if ((land / this.#map.length) >= this.#landCoverage) {
      return this.#map;
    }

    return this.generateLand();
  }

  generate() {
    this.generateLand();
    this.populateTerrain();

    return this.#map;
  }

  getNeighbours(index, directNeighbours = true) {
    const [x, y] = this.indexToCoords(index),

      n = this.coordsToIndex(x, y - 1),
      ne = this.coordsToIndex(x + 1, y - 1),
      e = this.coordsToIndex(x + 1, y),
      se = this.coordsToIndex(x + 1, y),
      s = this.coordsToIndex(x, y + 1),
      sw = this.coordsToIndex(x - 1, y + 1),
      w = this.coordsToIndex(x - 1, y),
      nw = this.coordsToIndex(x - 1, y - 1)
    ;

    return (
      directNeighbours ?
        [n, e, s, w] :
        [n, ne, e, se, s, sw, w, nw]
    );
  }

  populateTerrain() {
    const rules = this.#rulesRegistry.get('terrain:distribution');

    this.#rulesRegistry.get('terrain:distributionGroups')
      .filter((rule) => rule.validate())
      .map((rule) => rule.process())
      .forEach((group) => group.forEach((TerrainType) => rules
        .filter((rule) => rule.validate(TerrainType, this.#map))
        .map((rule) => rule.process(TerrainType, this.#map))
        .forEach((distribution) => distribution.forEach(
          ({
            cluster = false,
            clusterChance = this.#clusterChance,
            coverage = this.#coverage,
            fill = false,
            from = 0,
            path = false,
            pathChance = this.#pathChance,
            to = 1,
          }) => {
            const validIndices = Object.keys(this.#map)
              .filter((i) => this.#map[i] instanceof TerrainType.__proto__)
              .filter((i) =>
                (
                  i >= ((from * this.height) * this.width) &&
                  i <= ((to * this.height) * this.width)
                )
              )
            ;

            if (fill) {
              validIndices.forEach((index) => this.#map[index] = new TerrainType());

              return;
            }

            let max = validIndices.length * coverage;

            while (max > 0) {
              const currentIndex = validIndices[Math.floor(Math.random() * validIndices.length)];

              this.#map[currentIndex] = new TerrainType();
              max--;

              if (cluster) {
                const clusteredNeighbours = this.getNeighbours(currentIndex)
                  .filter((index) => ! (this.#map[index] instanceof TerrainType))
                ;

                while (clusteredNeighbours.length) {
                  const index = clusteredNeighbours.shift();

                  if (clusterChance >= (Math.random() / this.distanceFrom(currentIndex, index))) {
                    this.#map[index] = new TerrainType();
                    max--;

                    clusteredNeighbours.push(
                      ...this.getNeighbours(index)
                        .filter((index) => ! (this.#map[index] instanceof TerrainType))
                        .filter((index) => this.#map[index] instanceof TerrainType.__proto__)
                        .filter((index) => !(! clusteredNeighbours.includes(index)))
                    );
                  }
                }
              }

              if (path) {
                let index = currentIndex;

                while (pathChance >= Math.random()) {
                  const candidates = this.getNeighbours(index)
                    .filter((index) => (this.#map[index] instanceof TerrainType.__proto__) &&
                      ! (this.#map[index] instanceof TerrainType)
                    )
                  ;

                  index = candidates[Math.floor(Math.random() * candidates.length)];

                  this.#map[index] = new TerrainType();
                  max--;
                }
              }
            }
          }
        ))
      ))
    ;
  }
}

export default BaseGenerator;
