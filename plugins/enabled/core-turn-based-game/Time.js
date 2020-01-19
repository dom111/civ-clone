export class Time {
  static #ranges = [
    // 4000 BC - 1 AD
    {
      turn: 101,
      increment: 40,
    },
    // 1 AD - 1000 AD
    {
      turn: 151,
      increment: 20,
    },
    // 1000 AD - 1500 AD
    {
      turn: 201,
      increment: 10,
    },
    // 1500 AD - 1750 AD
    {
      turn: 251,
      increment: 5,
    },
    // 1750 AD - 1850 AD
    {
      turn: 301,
      increment: 2,
    },
    // 1850 AD +
    {
      turn: Infinity,
      increment: 1,
    },
  ];
  static #startYear = -4000;
  static #turn = 0;
  static #year = this.#startYear;

  static increment() {
    if (this.#turn++) {
      const [detail] = this.#ranges.filter((range) => range.turn >= this.#turn);

      this.#year += detail.increment;
    }

    engine.emit('time:year-updated', this.#year);

    return this;
  }

  static getYear(turn) {
    return this.#ranges.reduce((year, range) => {
      if (range.turn <= turn) {
        year += range.turn * range.increment;
        turn -= range.turn;
      }
      else if (turn > 0) {
        year += turn * range.increment;
        turn = 0;
      }

      return year;
    }, this.#startYear);
  }

  static valueOf() {
    return this.#turn;
  }

  static get turn() {
    return this.#turn;
  }

  static get year() {
    return this.#year;
  }
}

export default Time;
