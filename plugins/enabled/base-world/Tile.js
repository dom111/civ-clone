export class Tile {
  constructor(details) {
    const tile = this;

    Object.entries(details).forEach(([key, value]) => this[key] = value);

    // keep this as its own instance
    tile.terrain = {
      ...tile.terrain
    };

    tile.improvements = [];
    tile.city = false;
    tile.units = [];
    tile.seenBy = {};

    // when generating use this:
    // tile.seed = Math.ceil(Math.random() * 1e7);
    // tile.seed = tile.seed || (tile.x * tile.y * (tile.terrainId || 255));
    tile.seed = tile.seed || (tile.x ^ tile.y + (tile.terrainId || 255));

    if ('special' in tile.terrain && Array.isArray(tile.terrain.special)) {
      if (Array.isArray(tile.terrain.special) && tile.terrain.special.length) {
        const special = tile.terrain.special[Math.floor(tile.terrain.special.length * Math.random())];

        if ((tile.seed + tile.map.seed * ((tile.x + 1) + (tile.y + 1))) % 100 < special.chance) {
          tile.terrain.special = special;
        }
      }
    }

    if (Array.isArray(tile.terrain.special)) {
      tile.terrain.special = false;
    }
  }

  get neighbours() {
    return {
      n: this.map.get(this.x, this.y - 1),
      ne: this.map.get(this.x + 1, this.y - 1),
      e: this.map.get(this.x + 1, this.y),
      se: this.map.get(this.x + 1, this.y + 1),
      s: this.map.get(this.x, this.y + 1),
      sw: this.map.get(this.x - 1, this.y + 1),
      w: this.map.get(this.x - 1, this.y),
      nw: this.map.get(this.x - 1, this.y - 1)
    };
  }

  get adjacent() {
    return {
      n: this.map.get(this.x, this.y - 1),
      e: this.map.get(this.x + 1, this.y),
      w: this.map.get(this.x - 1, this.y),
      s: this.map.get(this.x, this.y + 1)
    };
  }

  // this is used to help with rendering contiguous terrain types
  get adjacentTerrain() {
    const tile = this,
      {adjacent} = tile
    ;

    return ['n', 'e', 's', 'w'].filter((position) => (adjacent[position].terrainId === tile.terrainId)).join('');
  }

  get isOcean() {
    return this.terrain.ocean;
  }

  get isCoast() {
    const tile = this;

    return tile.isOcean &&
      Object.keys(tile.neighbours).some((direction) => tile.neighbours[direction].isLand);
  }

  get coast() {
    const tile = this;

    return Object.keys(this.neighbours).filter((direction) => tile.neighbours[direction].isLand);
  }

  get isLand() {
    return this.terrain.land;
  }

  isVisible(playerId) {
    return this.seenBy[playerId];
  }

  isActivelyVisible(playerId) {
    return engine.players[playerId].visibleTiles.includes(this);
  }

  resource(type) {
    const tile = this;

    if ((typeof tile.terrain[type] === 'function')) {
      tile.terrain[type] = tile.terrain[type](tile.map, tile.x, tile.y);
    }

    return (this.terrain[type] + tile.improvements.map((improvement) => (tile.terrain.improvements[improvement] || {})[type] || 0).reduce((total, value) => total + value, 0)) || 0;
  }

  get trade() {
    return this.resource('trade');
  }

  get food() {
    return this.resource('food');
  }

  get production() {
    return this.resource('production');
  }

  get score() {
    return this.food * 8 + this.production * 4 + this.trade * 2;
  }

  get surroundingArea() {
    // TODO: make this take an argument of the layout and return the surrounding tiles based on that
    const {map} = this;

    const {x} = this;

    const {y} = this;

    return [
      map.get(x - 1, y - 2),
      map.get(x, y - 2),
      map.get(x + 1, y - 2),
      map.get(x - 2, y - 1),
      map.get(x - 1, y - 1),
      map.get(x, y - 1),
      map.get(x + 1, y - 1),
      map.get(x + 2, y - 1),
      map.get(x - 2, y),
      map.get(x - 1, y),
      map.get(x, y),
      map.get(x + 1, y),
      map.get(x + 2, y),
      map.get(x - 2, y + 1),
      map.get(x - 1, y + 1),
      map.get(x, y + 1),
      map.get(x + 1, y + 1),
      map.get(x + 2, y + 1),
      map.get(x - 1, y + 2),
      map.get(x, y + 2),
      map.get(x + 1, y + 2)
    ];
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