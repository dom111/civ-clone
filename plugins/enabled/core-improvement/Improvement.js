import City from 'core-city/City.js';

export default class Improvement {
  #built;
  #city;

  constructor(city) {
    this.#built = engine.turn;
    this.#city = city;

    city.improvements.push(this);
  }

  get city() {
    return this.#city;
  }

  static get(improvement) {
    return engine.City.improvements[improvement];
  }

  // TODO: maybe this should be done as part of the 'advance-discovered' event instead...
  static getAvailable(player) {
    return Object.keys(engine.City.improvements).filter((improvement) => {
      return (! engine.City.improvements[improvement].requires) || player.advances.includes(engine.City.improvements[improvement].requires);
    }).map((improvement) => {
      return engine.City.improvements[improvement];
    });
  }
}

Object.defineProperty(City, 'Improvement', {
  value: Improvement
});
Object.defineProperty(City, 'improvements', {
  value: []
});
