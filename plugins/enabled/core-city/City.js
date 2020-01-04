export default class City {
  static #availableBuildItems = [];

  constructor({
    player,
    tile,
    name,
  }) {
    this.player = player;
    this.tile = tile;
    this.name = name;

    // TODO: make these private + getter
    this.x = this.tile.x;
    this.y = this.tile.y;

    // TODO: this should be more scientific
    this.capital = (this.player.cities.length === 0);
    this.destroyed = false;
    this.size = 1;
    this.rates = {};
    this.improvements = [];
    this.foodStorage = 0; // TODO: total foodStorage (or define a method that returns it?)
    this.building = false;
    this.buildProgress = 0;

    // TODO: do this in player events on city:created
    this.player.cities.push(this);

    // main this tile, always worked
    this.tile.city = this;
    this.tiles = this.tile.surroundingArea;

    engine.emit('tile:improvement-built', this.tile, 'irrigation');
    engine.emit('tile:improvement-built', this.tile, 'road');
    engine.emit('city:created', this, this.tile);

    // setup
    this.autoAssignWorkers();
    this.calculateRates();
  }

  get ratesArray() {
    // TODO: check we have rates plugin available
    return engine.availableTradeRates.map((rate) => ({
      name: rate,
      value: this.rates[rate],
    }));
  }

  autoAssignWorkers() {
    this.tilesWorked = this.tiles
      .filter((tile) => tile.isVisible(this.player.id))
      .sort((a, b) => {
        const aScore = a.score(),
          bScore = b.score()
        ;

        return (aScore > bScore) ? -1 : (aScore === bScore) ? 0 : 1;
      })
      .slice(0, this.size)
    ;
  }

  calculateRates() {
    if (this.trade < 1) {
      return;
    }

    const trade = Array(this.trade).fill(1);

    // TODO: check we have rates plugin available
    engine.availableTradeRates.forEach((rate) => {
      this.rates[rate] = trade.splice(0, Math.ceil(this.player.getRate(rate) * this.trade))
        .reduce((total, value) => total + value, 0)
      ;
    });
  }

  resource(type) {
    const total = this.tile[type] + this.tilesWorked.map(
      (tile) => tile[type]
    )
      .reduce((total, value) => total + value, 0)
    ;

    // TODO: no hard-coded stuff!
    // Maybe something like:
    // city.player.government.resourceModifier(total);
    // if (city.player.government === 'despositm') {
    //     total = Math.ceil((total / 3) * 2);
    // }

    return total;
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
    return this.food - (this.size * 2);
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
    return ['ratesArray', 'trade', 'food', 'production', 'surplusFood', 'availableBuildItems'].reduce((city, key) => ({
      ...city,
      [key]: city[key],
    }), {
      ...this,
    });
  }

  static registerBuildItem(item) {
    City.#availableBuildItems.push(item);
  }
}
