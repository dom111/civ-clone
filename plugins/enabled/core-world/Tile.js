import {Land, Water} from '../core-terrain/Types.js';
import RulesRegistry from '../core-rules/RulesRegistry.js';
import Tileset from './Tileset.js';
import {Yield} from '../core-yields/Yield.js';
import YieldRegistry from '../core-yields/YieldRegistry.js';

export class Tile {
  constructor({x, y, terrain, map}) {
    this.x = x;
    this.y = y;
    this.terrain = terrain;
    this.map = map;

    this.improvements = [];
    this.features = [];
    this.city = false;
    this.units = [];
    this.seenBy = [];

    // when generating use this:
    // this.seed = Math.ceil(Math.random() * 1e7);
    // this.seed = this.seed || (this.x * this.y);
    this.seed = this.seed || (this.x ^ this.y);
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
    return ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw']
      .map((direction) => this.getNeighbour(direction))
    ;
  }

  getAdjacent() {
    return ['n', 'w', 's', 'w']
      .map((direction) => this.getNeighbour(direction))
    ;
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
      // .map(([x, y]) => [x * this.map.width, y * this.map.height])
      // .map(([x, y]) => [(this.x - tile.x) + x, (this.y - tile.y) + y])
      // .map((coords) => Math.hypot(...coords))
      .map(([x, y]) => Math.hypot(...[(this.x - tile.x) + (x * this.map.width), (this.y - tile.y) + (y * this.map.height)]))
      .sort((a, b) => a - b)
    ;

    return shortestDistance;
  }

  isOcean() {
    return this.terrain instanceof Water;
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

  isVisible(player) {
    return player.seenTiles.includes(this);
  }

  resource(type, player) {
    RulesRegistry.get('tile:yield')
      .filter((rule) => rule.validate(type, this, player))
      .forEach((rule) => rule.process(type, this, player))
    ;

    return type;
  }

  yields(
    player,
    yields = YieldRegistry.entries()
      .map((YieldType) => new YieldType())
  ) {
    return yields
      .map((tileYield) => this.resource(tileYield, player))
    ;
  }

  score({player, values = [[Yield, 3]]}) {
    const yields = this.yields(player);

    return yields.map((tileYield) => {
      const [value] = values.filter(([YieldType]) => tileYield instanceof YieldType),
        [, weight] = value || []
      ;

      return tileYield.value() * (weight || 0);
    })
      .reduce((total, value) => total + value, 0) *
      // Ensure we have some of each scored yield
      (values.every(([YieldType, value]) => (value < 1) || yields.some((tileYield) => tileYield instanceof YieldType)) ? 1 : 0)
    ;
  }

  getSurroundingArea(radius = 2) {
    return Tileset.fromSurrounding(this, radius);
  }

  movementCost(to) {
    // TODO: these defined separately, improvement plugins?
    if (this.improvements.includes('railroad') && to.improvements.includes('railroad')) {
      // TODO: unless goto...
      return 0;
    }
    else if (this.improvements.includes('road') && to.improvements.includes('road')) {
      return 1 / 3;
    }
    else {
      return to.terrain.movementCost;
    }
  }
}

export default Tile;