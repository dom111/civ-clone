import {Land, Water} from '../core-terrain/Types.js';
import {Generator as BaseGenerator} from '../core-world-generator/Generator.js';
import Rules from '../core-rules/Rules.js';
import TerrainFeatureRegistry from '../core-terrain-features/TerrainFeatureRegistry.js';
import TerrainRegistry from '../core-terrain/TerrainRegistry.js';

export class IslandsGenerator extends BaseGenerator {
  #chanceToBecomeLand;
  #clusterChance;
  #pathChance;
  #landCoverage;
  #landMassReductionScale;
  #map;
  #maxIterations;

  constructor({
    height = 100,
    width = 160,
    landCoverage = .66,
    landMassReductionScale = 1,
    chanceToBecomeLand = .05,
    clusterChance = .33,
    pathChance = .33,
    maxIterations = 3,
  } = {}) {
    super({height, width});

    this.#landCoverage = landCoverage; // total coverage required
    this.#chanceToBecomeLand = chanceToBecomeLand; // chance to become land
    this.#clusterChance = clusterChance; // chance for adjacent tiles to cluster
    this.#pathChance = pathChance; // chance for directly adjacent tiles to be part of the path
    this.#maxIterations = maxIterations; // number of times a tile can be tested to change to land
    this.#landMassReductionScale = landMassReductionScale;

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
          (Math.random() / (distance * this.#landMassReductionScale)) > this.#chanceToBecomeLand ||
          this.getNeighbours(currentTile, false)
            .reduce((total, n) => total + (this.#map[n] instanceof Land ? 1 : 0), 0) > 5
        ) {
          this.#map[currentTile] = new Land();

          toProcess.push(...this.getNeighbours(currentTile));
        }

        flagAsSeen(currentTile);
      }
    }

    const [water, land] = [Water, Land]
      .map((type) => this.#map
        .filter((tile) => tile instanceof type)
        .length
      )
    ;

    if ((land / water) < this.#landCoverage) {
      return this.generateLand();
    }

    return this.#map;
  }

  generate() {
    this.generateLand();
    this.populateTerrain();

    return this.#map;
  }

  getNeighbours(index, directNeighbours = true) {
    const [x, y] = this.indexToCoords(index),

      // TODO: validate these
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
    Rules.get('terrain:distributionGroups')
      .filter((rule) => rule.validate())
      .map((rule) => rule.process())
      .forEach((group) => group.forEach((TerrainType) => {
        Rules.get('terrain:distribution')
          .filter((rule) => rule.validate(TerrainType, this.#map))
          .map((rule) => rule.process(TerrainType, this.#map))
          .forEach((distribution) => distribution.forEach(
            ({
              cluster,
              clusterChance = this.#clusterChance,
              coverage,
              fill = false,
              from = 0,
              path,
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

                    if ((Math.random() / this.distanceFrom(currentIndex, index)) >= clusterChance) {
                      this.#map[index] = new TerrainType();
                      max--;

                      this.getNeighbours(index)
                        .filter((index) => ! (this.#map[index] instanceof TerrainType) &&
                          (this.#map[index] instanceof TerrainType.__proto__) &&
                          ! clusteredNeighbours.includes(index)
                        )
                        .forEach((index) => clusteredNeighbours.push(index))
                      ;
                    }
                  }
                }

                if (path) {
                  let index = currentIndex;

                  while (Math.random() > pathChance) {
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
        ;
      }))
    ;

    TerrainFeatureRegistry.entries()
      .forEach((TerrainFeature) => {
        TerrainRegistry.entries()
          .forEach((Terrain) => {
            this.#map
              .filter((terrain) => terrain instanceof Terrain)
              .forEach((terrain) => {
                Rules.get('terrain:feature')
                  .filter((rule) => rule.validate(TerrainFeature, Terrain))
                  .forEach((rule) => {
                    if (rule.process()) {
                      terrain.features.push(new TerrainFeature());
                    }
                  })
                ;
              })
            ;
          })
        ;
      })
    ;
  }
}

export default IslandsGenerator;
