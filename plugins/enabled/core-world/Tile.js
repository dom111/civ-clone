import {Land, Water} from '../core-terrain/Types.js';
import DataObject from '../core-data-object/DataObject.js';
import RulesRegistry from '../core-rules-registry/RulesRegistry.js';
import Tileset from './Tileset.js';
import {Yield} from '../core-yields/Yield.js';
import YieldRegistry from '../core-yields/YieldRegistry.js';

export class Tile extends DataObject {
  /** @type {World} */
  #map;
  /** @type {Tile[]} */
  #neighbours;
  /** @type {RulesRegistry} */
  #rulesRegistry;
  /** @type {Terrain} */
  #terrain;
  /** @type {number} */
  #x;
  /** @type {number} */
  #y;
  /** @type {Map} */
  #yieldCache = new Map();

  /**
   * @param x {number}
   * @param y {number}
   * @param terrain {Terrain}
   * @param map {World}
   * @param rulesRegistry {RulesRegistry}
   */
  constructor({x, y, terrain, map, rulesRegistry = RulesRegistry.getInstance()}) {
    super({
      rulesRegistry,
    });

    this.#x = x;
    this.#y = y;
    this.#terrain = terrain;
    this.#map = map;
    this.#rulesRegistry = rulesRegistry;
  }

  /**
   * @param player {Player}
   */
  clearYieldCache(player) {
    if (! player) {
      this.#yieldCache.clear();

      return;
    }

    this.#yieldCache.set(player, new Map());
  }

  /**
   * @returns {Tile}
   */
  clone() {
    return new Tile({
      x: this.#x,
      y: this.#y,
      terrain: this.#terrain.clone(),
      map: this.#map,
      rulesRegistry: this.#rulesRegistry,
    });
  }

  /**
   * @param player
   * @returns {Map}
   */
  getYieldCache(player) {
    if (! this.#yieldCache.has(player)) {
      this.#yieldCache.set(player, new Map());
    }

    return this.#yieldCache.get(player);
  }

  /**
   * @returns {Tile[]}
   */
  getAdjacent() {
    return ['n', 'e', 's', 'w']
      .map((direction) => this.getNeighbour(direction))
    ;
  }

  /**
   * @param direction {string}
   * @returns {Tile}
   */
  getNeighbour(direction) {
    if (direction === 'n') {
      return this.#map.get(this.#x, this.#y - 1);
    }

    if (direction === 'ne') {
      return this.#map.get(this.#x + 1, this.#y - 1);
    }


    if (direction === 'e') {
      return this.#map.get(this.#x + 1, this.#y);
    }


    if (direction === 'se') {
      return this.#map.get(this.#x + 1, this.#y + 1);
    }


    if (direction === 's') {
      return this.#map.get(this.#x, this.#y + 1);
    }


    if (direction === 'sw') {
      return this.#map.get(this.#x - 1, this.#y + 1);
    }


    if (direction === 'w') {
      return this.#map.get(this.#x - 1, this.#y);
    }


    if (direction === 'nw') {
      return this.#map.get(this.#x - 1, this.#y - 1);
    }
  }

  /**
   * @returns {Tile[]}
   */
  getNeighbours() {
    if (! this.#neighbours) {
      this.#neighbours = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw']
        .map((direction) => this.getNeighbour(direction))
      ;
    }

    return this.#neighbours;
  }

  /**
   * @param radius {number}
   * @returns {Tileset}
   */
  getSurroundingArea(radius = 2) {
    return Tileset.fromSurrounding(this, radius);
  }

  /**
   * @param tile {Tile}
   * @returns {number}
   */
  distanceFrom(tile) {
    const [shortestDistance] = [
      [-1, 1],
      [-1, 0],
      [-1, -1],
      [0, 1],
      [0, 0],
      [0, -1],
      [1, 1],
      [1, 0],
      [1, -1],
    ]
      .map(([x, y]) => Math.hypot(...[(this.#x - tile.x()) + (x * this.#map.width()), (this.#y - tile.y()) + (y * this.#map.height())]))
      .sort((a, b) => a - b)
    ;

    return shortestDistance;
  }

  /**
   * @returns {boolean}
   */
  isCoast() {
    const tile = this;

    return (
      tile.isWater() &&
      tile.getNeighbours().some((tile) => tile.isLand())
    ) || (
      tile.isLand() &&
      tile.getNeighbours().some((tile) => tile.isWater())
    );
  }

  /**
   * @returns {boolean}
   */
  isLand() {
    return this.#terrain instanceof Land;
  }

  /**
   * @param otherTile {Tile}
   * @returns {boolean}
   */
  isNeighbourOf(otherTile) {
    return this.getNeighbours()
      .includes(otherTile)
    ;
  }

  /**
   * @returns {boolean}
   */
  isWater() {
    return this.#terrain instanceof Water;
  }

  /**
   * @param player {Player}
   * @returns {boolean}
   */
  isVisible(player) {
    return player.seenTiles().includes(this);
  }

  // static load(data, map) {
  //   return new this({
  //     map,
  //     terrain: Terrain.load(data.terrain),
  //     x: data.x,
  //     y: data.y,
  //   });
  // }

  /**
   * @returns {string[]}
   */
  keys() {
    return [
      'terrain',
      'x',
      'y',
      // TODO: this needs to be passed the player, or be handled in another way...
      'yields',
      ...super.keys(),
    ];
  }

  /**
   * @returns {World}
   */
  map() {
    return this.#map;
  }

  /**
   * @param type {Yield}
   * @param player {Player}
   * @returns {Yield}
   */
  resource(type, player) {
    const yieldCache = this.getYieldCache(player);

    if (yieldCache.has(type.constructor)) {
      const cachedYield = yieldCache.get(type.constructor);

      type.add(cachedYield);

      return type;
    }

    this.#rulesRegistry.process('tile:yield', type, this, player);

    yieldCache.set(type.constructor, type.value());

    return type;
  }

  // save() {
  //   return {
  //     Type: this.constructor.name,
  //     terrain: this.#terrain.save(),
  //     x: this.#x,
  //     y: this.#y,
  //   };
  // }

  /**
   * @param player {Player}
   * @param values {[[Yield, number]]}
   * @returns {number}
   */
  score({player, values = [[Yield, 3]]}) {
    const yields = this.yields({player});

    return yields.map((tileYield) => {
      const [value] = values.filter(([YieldType]) => tileYield instanceof YieldType),
        [, weight] = value || []
        ;

      return tileYield.value() * (weight || 0);
    })
      .reduce((total, value) => total + value, 0) *
      // Ensure we have some of each scored yield
      (values.every(([YieldType, value]) => (value < 1) ||
        yields.some((tileYield) => tileYield instanceof YieldType)) ? 1 : 0
      )
    ;
  }

  /**
   * @returns {Terrain}
   */
  terrain() {
    return this.#terrain;
  }

  /**
   * @param terrain
   */
  setTerrain(terrain) {
    this.#terrain = terrain;
  }

  /**
   * @returns {number}
   */
  x() {
    return this.#x;
  }

  /**
   * @returns {number}
   */
  y() {
    return this.#y;
  }

  /**
   * @param player {Player}
   * @param yieldRegistry {YieldRegistry}
   * @param yields {Yield[]}
   * @returns {Yield[]}
   */
  yields({
    player,
    yieldRegistry = YieldRegistry.getInstance(),
    yields = yieldRegistry.entries(),
  } = {}) {
    return yields.map((YieldType) => this.resource(new YieldType(), player));
  }
}

export default Tile;
