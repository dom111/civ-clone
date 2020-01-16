import Rules from '../core-rules/Rules.js';

export default class City {
  static #availableBuildUnits = [];
  static #availableBuildImprovements = [];

  // TODO: make these all private
  buildCost = 0;
  buildProgress = 0;
  building = false;
  capital = false;
  destroyed = false;
  foodStorage = 0;
  improvements = [];
  name;
  player;
  size = 1;
  tile;
  tiles;
  units = [];

  constructor({
    player,
    tile,
    name,
  }) {
    this.player = player;
    this.tile = tile;
    this.name = name;

    // main this tile, always worked
    tile.city = this;
    this.tiles = this.tile.surroundingArea;

    engine.emit('tile:improvement-built', tile, 'irrigation');
    engine.emit('tile:improvement-built', tile, 'road');
    engine.emit('city:created', this, tile);

    // setup
    this.autoAssignWorkers();
  }

  autoAssignWorkers() {
    this.tilesWorked = [this.tile, ...this.tiles
      .filter((tile) => tile.isVisible(this.player))
      .sort((a, b) => b.score() - a.score())
      .slice(0, this.size),
    ];
  }

  resource(type) {
    return this.tilesWorked.map(
      (tile) => Rules.get(`tile:${type}`)
        .filter((rule) => rule.validate(tile, this.player))
        .map((rule) => rule.process(tile, this.player))
        .sort()
        .pop() || 0
    )
      .reduce((total, value) => total + value, 0)
    ;
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

  get surplusFood() {
    // TODO: use Rules
    return this.food - (
      this.size * 2
    );
  }

  get availableBuildUnits() {
    const buildRules = Rules.get('city:build:unit');

    return City.#availableBuildUnits
      .filter((buildItem) => buildRules.every((rule) => rule.validate(this, buildItem)))
    ;
  }

  get availableBuildImprovements() {
    const buildRules = Rules.get('city:build:improvement');

    return City.#availableBuildImprovements
      .filter((buildItem) => buildRules.every((rule) => rule.validate(this, buildItem)))
    ;
  }

  get availableBuildItems() {
    return [
      ...this.availableBuildUnits,
      ...this.availableBuildImprovements,
    ];
  }

  build(item) {
    this.building = item;

    [this.buildCost] = Rules.get('city:build-cost')
      .filter((rule) => rule.validate(item, this))
      .map((rule) => rule.process(item, this))
      .sort((a, b) => a - b)
    ;

    if (! this.buildCost) {
      throw new TypeError(`${this.building}`);
    }

    engine.emit('city:build', this, item);
  }

  valueOf() {
    return ['ratesArray', 'trade', 'food', 'production', 'surplusFood', 'availableBuildItems'].reduce((city, key) => (
      {
        ...city,
        [key]: city[key],
      }
    ), {
      ...this,
    });
  }

  static registerBuildUnit(constructor) {
    if (! this.#availableBuildUnits.includes(constructor)) {
      this.#availableBuildUnits.push(constructor);
    }
  }

  static registerBuildImprovement(constructor) {
    if (! this.#availableBuildImprovements.includes(constructor)) {
      this.#availableBuildImprovements.push(constructor);
    }
  }
}
