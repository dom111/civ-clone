import {Land, Water} from '../core-terrain/Types.js';
import RulesRegistry from '../core-rules/RulesRegistry.js';
import Tileset from './Tileset.js';
import {Yield} from '../core-yields/Yield.js';
import YieldRegistry from '../core-yields/YieldRegistry.js';

export class Tile {
  #neighbours;
  #rulesRegistry;
  #yieldCache = new Map();

  constructor({x, y, terrain, map, rulesRegistry = RulesRegistry.getInstance()}) {
    this.x = x;
    this.y = y;
    this.terrain = terrain;
    this.map = map;

    this.#rulesRegistry = rulesRegistry;

    this.features = [];

    // when generating use this:
    // this.seed = Math.ceil(Math.random() * 1e7);
    // this.seed = this.seed || (this.x * this.y);
    this.seed = this.seed || (this.x ^ this.y);
  }

  clearYieldCache(player) {
    if (! player) {
      this.#yieldCache.clear();

      return;
    }

    this.#yieldCache.set(player, new Map());
  }

  getYieldCache(player) {
    if (! this.#yieldCache.has(player)) {
      this.#yieldCache.set(player, new Map());
    }

    return this.#yieldCache.get(player);
  }

  get(tile) {
    if (['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'].includes(tile)) {
      return this.getNeighbour(tile);
    }

    if (tile instanceof Tile) {
      return tile;
    }

    throw new TypeError(`Tile#get: Expected tile to be a neighbour alias or instance of Tile, got '${typeof tile}'.`);
  }

  getAdjacent() {
    return ['n', 'e', 's', 'w']
      .map((direction) => this.getNeighbour(direction))
    ;
  }

  getNeighbour(direction) {
    if (direction === 'n') {
      return this.map.get(this.x, this.y - 1);
    }

    if (direction === 'ne') {
      return this.map.get(this.x + 1, this.y - 1);
    }


    if (direction === 'e') {
      return this.map.get(this.x + 1, this.y);
    }


    if (direction === 'se') {
      return this.map.get(this.x + 1, this.y + 1);
    }


    if (direction === 's') {
      return this.map.get(this.x, this.y + 1);
    }


    if (direction === 'sw') {
      return this.map.get(this.x - 1, this.y + 1);
    }


    if (direction === 'w') {
      return this.map.get(this.x - 1, this.y);
    }


    if (direction === 'nw') {
      return this.map.get(this.x - 1, this.y - 1);
    }
  }

  getNeighbours() {
    if (! this.#neighbours) {
      this.#neighbours = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw']
        .map((direction) => this.getNeighbour(direction))
      ;
    }

    return this.#neighbours;
  }

  getSurroundingArea(radius = 2) {
    return Tileset.fromSurrounding(this, radius);
  }

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
      .map(([x, y]) => Math.hypot(...[(this.x - tile.x) + (x * this.map.width), (this.y - tile.y) + (y * this.map.height)]))
      .sort((a, b) => a - b)
    ;

    return shortestDistance;
  }

  isCoast() {
    const tile = this;

    return (
      tile.isOcean() &&
      tile.getNeighbours().some((tile) => tile.isLand())
    ) || (
      tile.isLand() &&
      tile.getNeighbours().some((tile) => tile.isOcean())
    );
  }

  isLand() {
    return this.terrain instanceof Land;
  }

  isNeighbourOf(otherTile) {
    return this.getNeighbours()
      .includes(otherTile)
    ;
  }

  isOcean() {
    return this.terrain instanceof Water;
  }

  isVisible(player) {
    return player.seenTiles.includes(this);
  }

  // static load(data, map) {
  //   return new this({
  //     map,
  //     terrain: Terrain.load(data.terrain),
  //     x: data.x,
  //     y: data.y,
  //   });
  // }

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
  //     terrain: this.terrain.save(),
  //     x: this.x,
  //     y: this.y,
  //   };
  // }

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

  yields({
    player,
    yieldRegistry = YieldRegistry.getInstance(),
    yields = yieldRegistry.entries(),
  }) {
    if (yields.some((y) => typeof y !==  'function')) {
      throw new Error('blah');
    }

    return yields.map((YieldType) => this.resource(new YieldType(), player));
  }
}

export default Tile;