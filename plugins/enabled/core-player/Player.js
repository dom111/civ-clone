export class Player {
  static id = 0;

  #availableRates;
  #visibleTiles = [];

  civilization;

  constructor() {
    this.id = Player.id++;
    this.cities = [];
    this.units = [];
    this.#availableRates = [...engine.availableTradeRates];
    this.rates = {};
    this.availableUnits = [];
    this.availableImprovements = [];

    engine.emit('player:added', this);

    this.assignRates();
  }

  get actions() {
    return [
      ...this.citiesToAction,
      ...this.unitsToAction,
    ];
  }

  get unitsToAction() {
    return this.units.filter((unit) => unit.active && unit.movesLeft);
  }

  get citiesToAction() {
    return this.cities.filter((city) => ! city.building);
  }

  get actionsLeft() {
    return this.unitsToAction.length + this.citiesToAction.length;
  }

  get visibleTiles() {
    if (! this.#visibleTiles.length) {
      this.units.forEach((unit) => {
        for (let x = -unit.visibility; x <= unit.visibility; x++) {
          for (let y = -unit.visibility; y <= unit.visibility; y++) {
            const tile = unit.tile.map.get(unit.tile.x + x, unit.tile.y + y);

            if (! this.#visibleTiles.includes(tile)) {
              this.#visibleTiles.push(tile);
            }
          }
        }
      });

      this.cities.forEach((city) => {
        for (let x = -2; x <= 2; x++) {
          for (let y = -2; y <= 2; y++) {
            const tile = city.tile.map.get(city.tile.x + x, city.tile.y + y);

            if (! this.#visibleTiles.includes(tile)) {
              this.#visibleTiles.push(tile);
            }
          }
        }
      });
    }

    return this.#visibleTiles;
  }

  assignRates() {
    let remaining = 1;

    this.#availableRates.forEach((rate) => {
      this.rates[rate] = Math.ceil((1 / this.#availableRates.length) * 100) / 100;
      remaining -= this.rates[rate];
    });

    this.rates[this.#availableRates[0]] += remaining; // TODO, spread more evenly, also, maybe 5% increments?
  }

  getRate(rate) {
    if (this.#availableRates.includes(rate)) {
      return this.rates[rate];
    }

    throw `No rate '${rate}'!`;
  }

  takeTurn() {
    return promiseFactory((resolve, reject) => {
      reject('Not implemented.');
    });
  }
}

export default Player;