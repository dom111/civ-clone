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

        engine.emit('player:visibility-changed', this);
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
      unit.tile.getSurroundingArea(unit.visibility)
        .forEach((tile) => {
          if (! visibleTiles.includes(tile)) {
            visibleTiles.push(tile);
          }
        })
      ;
    });

    this.cities.forEach((city) => {
      city.tile.getSurroundingArea()
        .forEach((tile) => {
          if (! visibleTiles.includes(tile)) {
            visibleTiles.push(tile);
          }
        })
      ;
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