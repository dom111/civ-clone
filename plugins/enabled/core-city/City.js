import Rule from '../core-rules/Rule.js';

export default class City {
  static #availableBuildItems = [];

  // TODO: make these all private
  buildProgress = 0;
  building = false;
  capital = false;
  destroyed = false;
  foodStorage = 0;
  improvements = [];
  name;
  player;
  rates = {};
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

    // TODO: this should be more scientific
    this.capital = player.cities.length === 0;

    // TODO: do this in player events on city:created
    player.cities.push(this);

    // main this tile, always worked
    tile.city = this;
    this.tiles = this.tile.surroundingArea;

    engine.emit('tile:improvement-built', tile, 'irrigation');
    engine.emit('tile:improvement-built', tile, 'road');
    engine.emit('city:created', this, tile);

    // setup
    this.autoAssignWorkers();
    // this.calculateRates();
  }

  //
  // get ratesArray() {
  //   // TODO: check we have rates plugin available
  //   return engine.availableTradeRates.map((rate) => ({
  //     name: rate,
  //     value: this.rates[rate],
  //   }));
  // }

  autoAssignWorkers() {
    this.tilesWorked = [this.tile, ...this.tiles
      .filter((tile) => tile.isVisible(this.player))
      .sort((a, b) => b.score() - a.score())
      .slice(0, this.size),
    ];
  }

  // calculateRates() {
  //   if (this.trade < 1) {
  //     return;
  //   }
  //
  //   const trade = Array(this.trade).fill(1);
  //
  //   // TODO: check we have rates plugin available
  //   engine.availableTradeRates.forEach((rate) => {
  //     this.rates[rate] = trade.splice(0, Math.ceil(this.player.getRate(rate) * this.trade))
  //       .reduce((total, value) => total + value, 0)
  //     ;
  //   });
  // }

  resource(type) {
    return this.tilesWorked.map(
      (tile) => Rule.get(`tile:${type}`)
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

  get availableBuildItems() {
    // TODO: process these for availability (advances/government/etc)
    return City.#availableBuildItems;
  }

  build(item) {
    this.building = item;

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

  static registerBuildItem(item) {
    City.#availableBuildItems.push(item);
  }
}
