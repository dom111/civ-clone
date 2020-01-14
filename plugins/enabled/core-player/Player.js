import Tileset from '../core-world/Tileset.js';

export class Player {
  static id = 0;

  #seenTiles = new Tileset();

  civilization;

  constructor() {
    this.id = Player.id++;
    this.cities = [];
    this.units = [];

    engine.emit('player:added', this);
    engine.on('tile:seen', (tile) => {
      if (! this.#seenTiles.includes(tile)) {
        this.#seenTiles.push(tile);
      }
    });
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

  get seenTiles() {
    return this.#seenTiles;
  }

  get visibleTiles() {
    const visibleTiles = [];

    this.units.forEach((unit) => {
      for (let x = -unit.visibility; x <= unit.visibility; x++) {
        for (let y = -unit.visibility; y <= unit.visibility; y++) {
          const tile = unit.tile.map.get(unit.tile.x + x, unit.tile.y + y);

          if (! visibleTiles.includes(tile)) {
            visibleTiles.push(tile);
          }
        }
      }
    });

    this.cities.forEach((city) => {
      for (let x = -2; x <= 2; x++) {
        for (let y = -2; y <= 2; y++) {
          const tile = city.tile.map.get(city.tile.x + x, city.tile.y + y);

          if (! visibleTiles.includes(tile)) {
            visibleTiles.push(tile);
          }
        }
      }
    });

    return visibleTiles;
  }

  takeTurn() {
    return promiseFactory((resolve, reject) => {
      reject('Not implemented.');
    });
  }
}

export default Player;