export default class City {
  constructor({
    player,
    tile,
    name
  }) {
    this.player = player;
    this.tile = tile;
    this.name = name;

    this.build('militia');

    this.x = this.tile.x;
    this.y = this.tile.y;
    this.capital = (this.player.cities.length === 0);
    this.destroyed = false;
    this.size = 1;
    this.rates = {};
    this.improvements = [];
    this.foodStorage = 0; // TODO: total foodStorage (or define a method that returns it?)
    this.building = false;

    this.player.cities.push(this);

    // main this tile, always worked
    this.tile.this = this;
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
      value: this.rates[rate]
    }));
  }

  autoAssignWorkers() {
    this.tilesWorked = this.tiles.filter((tile) => tile.isVisible(this.player.id)).map((tile, id) => {
      return {
        score: tile.score,
        id: id
      };
    }).sort((a, b) => (a.score > b.score) ? -1 : (a.score === b.score) ? 0 : 1).map((tile) => tile.id).slice(0, this.size);
  }

  calculateRates() {
    const trade = Array(this.trade).fill(1)    ;

    // TODO: check we have rates plugin available
    engine.availableTradeRates.forEach((rate) => {
      this.rates[rate] = trade.splice(0, Math.ceil(this.player.getRate(rate) * this.trade)).reduce((total, value) => total + value, 0);
    });
  }

  resource(type) {
    const total = this.tile[type] + this.tilesWorked.map((tileId) => this.tiles[tileId][type]).reduce((total, value) => total + value);

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
    return [
      ...this.availableUnits,
      ...this.availableImprovements,
      ...this.availableWonders,
      ...this.availableProjects
    ];
  }

  get availableUnits() {
    return [];
  }

  get availableImprovements() {
    return [];
  }

  get availableProjects() {
    return [];
  }

  get availableWonders() {
    return [];
  }

  build(itemName) {
    [this.building] = this.availableBuildItems.filter((item) => {
      if ('unit' in item) {
        return item.unit === itemName;
      }
      else if ('building' in item) {
        return item.building === itemName;
      }
    });
  }

  showCityScreen() {
    // const _show = () => {
    //     // TODO, this shouldn't be accessing the renderer, but exposing an event that the renderer can listen
    //     //  for, or perhaps adding to an observed renderQueue adding a RenderObject?
    //     view = global.renderer.addToBody(
    //       engine.template(
    //         Engine.Plugin.filter({
    //           type: 'template',
    //           label: 'city:view',
    //           package: 'base-city'
    //         })[0].contents[0],
    //         {
    //           ...this.valueOf()
    //         }
    //       )
    //     );
    //
    //     // TODO: bind more clicks
    //     view.querySelector('.close').addEventListener('click', _remove);
    //
    //     view.querySelector('.change').addEventListener('click', () => {
    //       Object.defineProperties(this.building, this.availableBuildItems[Date.now() % this.availableBuildItems.length]);
    //       _refresh();
    //     });
    //
    //     return view;
    //   },
    //   _remove = () => view.parentNode.removeChild(view),
    //   _refresh = () => {
    //     _remove();
    //     _show();
    //   }
    // ;
    //
    // let view;
    //
    // _show();
  }

  valueOf() {
    return ['ratesArray', 'trade', 'food', 'production', 'surplusFood', 'availableBuildItems'].reduce((city, key) => ({
      ...city,
      [key]: city[key]
    }), {
      ...this
    });
  }
}
