import RulesRegistry from '../core-rules-registry/RulesRegistry.js';
import Tileset from '../core-world/Tileset.js';
import YieldRegistry from '../core-yields/YieldRegistry.js';

export class City {
  #name;
  #originalPlayer;
  #player;
  #rulesRegistry;
  #size = 1;
  #tile;
  #tiles;
  #tilesWorked = new Tileset();

  constructor({
    player,
    tile,
    name,
    rulesRegistry = RulesRegistry.getInstance(),
  }) {
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

  capture(player) {
    this.#player = player;

    this.#rulesRegistry.process('city:captured', this, player);
  }

  destroy(player = null) {
    this.#rulesRegistry.process('city:destroyed', this, player);
  }

  grow() {
    this.#size++;

    this.#rulesRegistry.process('city:grow', this);
  }

  name() {
    return this.#name;
  }

  originalPlayer() {
    return this.#originalPlayer;
  }

  player() {
    return this.#player;
  }

  shrink() {
    this.#size--;

    this.#rulesRegistry.process('city:shrink', this);
  }

  size() {
    return this.#size;
  }

  tile() {
    return this.#tile;
  }

  tilesWorked() {
    return this.#tilesWorked;
  }

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
