import RulesRegistry from '../core-rules/RulesRegistry.js';
import Tileset from '../core-world/Tileset.js';

export class City {
  #name;
  #originalPlayer;
  #player;
  #size = 1;
  #tile;
  #tiles;
  #tilesWorked = new Tileset();

  // TODO: break this into a Registry as a Yield
  foodStorage = 0;

  constructor({
    player,
    tile,
    name,
  }) {
    this.#name = name;
    this.#originalPlayer = player;
    this.#player = player;
    this.#tile = tile;
    this.#tiles = this.#tile.getSurroundingArea();

    RulesRegistry.get('city:created')
      .filter((rule) => rule.validate(this))
      .forEach((rule) => rule.process(this))
    ;

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

    RulesRegistry.get('city:captured')
      .filter((rule) => rule.validate(this, player))
      .forEach((rule) => rule.process(this, player))
    ;
  }

  destroy(player = null) {
    RulesRegistry.get('city:destroyed')
      .filter((rule) => rule.validate(this, player))
      .forEach((rule) => rule.process(this, player))
    ;
  }

  grow() {
    this.#size++;

    RulesRegistry.get('city:grow')
      .filter((rule) => rule.validate(this))
      .forEach((rule) => rule.process(this));
  }

  get name() {
    return this.#name;
  }

  get originalPlayer() {
    return this.#originalPlayer;
  }

  get player() {
    return this.#player;
  }

  shrink() {
    this.#size--;

    RulesRegistry.get('city:shrink')
      .filter((rule) => rule.validate(this))
      .forEach((rule) => rule.process(this))
    ;
  }

  get size() {
    return this.#size;
  }

  get tile() {
    return this.#tile;
  }

  get tilesWorked() {
    return this.#tilesWorked;
  }

  yields() {
    const yields = this.#tilesWorked
      .yields(this.player)
    ;

    // Do for...of so that as yields are added, they too are processed.
    for (const cityYield of yields) {
      RulesRegistry.get('city:yield')
        .filter((rule) => rule.validate(cityYield, this, yields))
        .forEach((rule) => rule.process(cityYield, this, yields))
      ;

      RulesRegistry.get('city:cost')
        .filter((rule) => rule.validate(cityYield, this, yields))
        .forEach((rule) => rule.process(cityYield, this, yields))
      ;
    }

    return yields;
  }
}

export default City;
