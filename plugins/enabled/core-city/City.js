import DataObject from '../core-data-object/DataObject.js';
import RulesRegistry from '../core-rules-registry/RulesRegistry.js';
import Tileset from '../core-world/Tileset.js';
import YieldRegistry from '../core-yields/YieldRegistry.js';

export class City extends DataObject {
  /** @type {string} */
  #name;
  /** @type {Player} */
  #originalPlayer;
  /** @type {Player} */
  #player;
  /** @type {RulesRegistry} */
  #rulesRegistry;
  /** @type {number} */
  #size = 1;
  /** @type {Tile} */
  #tile;
  /** @type {Tileset} */
  #tiles;
  /** @type {Tileset} */
  #tilesWorked = new Tileset();

  /**
   * @param player {Player}
   * @param tile {Tile}
   * @param name {string}
   * @param rulesRegistry {RulesRegistry}
   */
  constructor({
    player,
    tile,
    name,
    rulesRegistry = RulesRegistry.getInstance(),
  }) {
    super({
      rulesRegistry,
    });

    this.#name = name;
    this.#originalPlayer = player;
    this.#player = player;
    this.#tile = tile;
    this.#tiles = this.#tile.getSurroundingArea();
    this.#tilesWorked.push(tile);
    this.#rulesRegistry = rulesRegistry;

    this.#rulesRegistry.process('city:created', this);
    this.assignUnassignedWorkers();
  }

  assignUnassignedWorkers() {
    this.#tilesWorked.push(
      ...this.#tiles
        .filter((tile) => ! this.#tilesWorked.includes(tile))
        .filter((tile) => tile.isVisible(this.#player))
        .sort((a, b) => b.score({
          player: this.#player,
        }) - a.score({
          player: this.#player,
        }))
        // +1 here because we also work the main city tile
        .slice(0, (this.#size + 1) - this.#tilesWorked.length)
    );

    if (this.#tilesWorked.length !== (this.#size + 1)) {
      this.autoAssignWorkers();
    }
  }

  autoAssignWorkers() {
    this.#tilesWorked = Tileset.from(this.#tile, ...this.#tiles
      .filter((tile) => tile.isVisible(this.#player))
      .sort((a, b) => b.score({
        player: this.#player,
      }) - a.score({
        player: this.#player,
      }))
      .slice(0, this.#size)
    );
  }

  /**
   * @param player {Player}
   */
  capture(player) {
    this.#player = player;

    this.#rulesRegistry.process('city:captured', this, player);
  }

  /**
   * @param player {Player|null}
   */
  destroy(player = null) {
    this.#rulesRegistry.process('city:destroyed', this, player);
  }

  grow() {
    this.#size++;

    this.#rulesRegistry.process('city:grow', this);
  }

  /**
   * @returns {string[]}
   */
  keys() {
    return [
      'name',
      'player',
      'size',
      'tile',
      'tilesWorked',
      'yields',
      ...super.keys(),
    ];
  }

  /**
   * @returns {string}
   */
  name() {
    return this.#name;
  }

  /**
   * @returns {Player}
   */
  originalPlayer() {
    return this.#originalPlayer;
  }

  /**
   * @returns {Player}
   */
  player() {
    return this.#player;
  }

  shrink() {
    this.#size--;

    this.#rulesRegistry.process('city:shrink', this);
  }

  /**
   * @returns {number}
   */
  size() {
    return this.#size;
  }

  /**
   * @returns {Tile}
   */
  tile() {
    return this.#tile;
  }

  /**
   * @returns {Tileset}
   */
  tilesWorked() {
    return this.#tilesWorked;
  }

  /**
   * @param yieldRegistry {YieldRegistry}
   * @param yields {class[]}
   * @returns {Yield[]}
   */
  yields({
    yieldRegistry = YieldRegistry.getInstance(),
    yields = yieldRegistry.entries(),
  } = {}) {
    const tilesetYields = this.#tilesWorked
      .yields({
        yields,
        player: this.#player,
      })
    ;

    // Do for...of so that as yields are added, they too are processed.
    for (const cityYield of tilesetYields) {
      this.#rulesRegistry.process('city:yield', cityYield, this, tilesetYields);
      this.#rulesRegistry.process('city:cost', cityYield, this, tilesetYields);
    }

    return tilesetYields;
  }
}

export default City;
